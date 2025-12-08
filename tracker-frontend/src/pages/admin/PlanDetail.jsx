import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', startDate: '', totalWeeks: 4 });
  const [taskForm, setTaskForm] = useState({ topicId: '', weekNumber: 1, dayNumber: 1 });
  const [editingTask, setEditingTask] = useState(null);
  const [err, setErr] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filterWeek, setFilterWeek] = useState('all');

  const loadPlan = useCallback(async () => {
    try {
      const r = await api.get(`/admin/plans/${id}`);
      setPlan(r.data);
      const startDate = r.data.startDate ? new Date(r.data.startDate).toISOString().split('T')[0] : '';
      setForm({
        name: r.data.name || '',
        startDate: startDate,
        totalWeeks: r.data.totalWeeks || 4
      });
    } catch (e) {
      console.error(e);
      setErr('Failed to load plan');
    }
  }, [id]);

  const loadTasks = useCallback(async () => {
    try {
      const r = await api.get(`/admin/plans/${id}/tasks`);
      setTasks(r.data || []);
    } catch (e) {
      console.error(e);
      setErr('Failed to load tasks');
    }
  }, [id]);

  const loadTopics = useCallback(async () => {
    try {
      const r = await api.get('/topics');
      setTopics(r.data || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadPlan(), loadTasks(), loadTopics()]);
      setLoading(false);
    };
    loadAll();
  }, [loadPlan, loadTasks, loadTopics]);

  async function updatePlan() {
    try {
      await api.put(`/admin/plans/${id}`, form);
      await loadPlan();
      setErr('');
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function createTask() {
    try {
      await api.post(`/admin/plans/${id}/tasks`, taskForm);
      await loadTasks();
      setTaskForm({ topicId: '', weekNumber: 1, dayNumber: 1 });
      setShowTaskForm(false);
      setErr('');
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function updateTask() {
    try {
      await api.put(`/admin/plans/${id}/tasks/${editingTask.id}`, taskForm);
      await loadTasks();
      setEditingTask(null);
      setTaskForm({ topicId: '', weekNumber: 1, dayNumber: 1 });
      setShowTaskForm(false);
      setErr('');
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/admin/plans/${id}/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  function startEdit(task) {
    setEditingTask(task);
    setTaskForm({
      topicId: task.topicId,
      weekNumber: task.weekNumber,
      dayNumber: task.dayNumber
    });
    setShowTaskForm(true);
  }

  function cancelEdit() {
    setEditingTask(null);
    setTaskForm({ topicId: '', weekNumber: 1, dayNumber: 1 });
    setShowTaskForm(false);
  }

  async function handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    // Skip header row if present
    const startIndex = lines[0].toLowerCase().includes('week') ? 1 : 0;
    
    // Expected: Week, Day, Topic Title (or Topic ID)
    const tasksToImport = [];
    for (let i = startIndex; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const weekNum = parseInt(values[0]);
      const dayNum = parseInt(values[1]);
      const topicTitle = values[2];
      
      // Find topic by title
      const topic = topics.find(t => t.title === topicTitle);
      if (topic && weekNum && dayNum) {
        tasksToImport.push({
          topicId: topic.id,
          weekNumber: weekNum,
          dayNumber: dayNum
        });
      }
    }

    if (tasksToImport.length > 0) {
      try {
        await api.post(`/admin/plans/${id}/tasks/bulk`, { tasks: tasksToImport });
        await loadTasks();
        setErr('');
        alert(`Imported ${tasksToImport.length} tasks successfully`);
      } catch (err) {
        setErr(err.response?.data?.error || err.message);
      }
    }
    e.target.value = '';
  }

  async function exportCSV() {
    try {
      const response = await api.get(`/admin/plans/${id}/export/csv`, {
        responseType: 'text'
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plan-${plan?.name || 'export'}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErr(err.response?.data?.error || 'Failed to export CSV');
    }
  }

  async function exportJSON() {
    try {
      const response = await api.get(`/admin/plans/${id}/export/json`);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plan-${plan?.name || 'export'}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErr(err.response?.data?.error || 'Failed to export JSON');
    }
  }

  function exportPDF() {
    // For PDF, we'll generate it on the frontend using window.print or a library
    // For now, we'll use a simple approach
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head><title>Plan: ${plan?.name}</title></head>
        <body>
          <h1>${plan?.name}</h1>
          <p>Start Date: ${plan?.startDate ? new Date(plan.startDate).toLocaleDateString() : 'N/A'}</p>
          <p>Total Weeks: ${plan?.totalWeeks}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>Week</th><th>Day</th><th>Topic</th><th>Category</th><th>Subcategory</th>
            </tr>
            ${filteredTasks.map(t => `
              <tr>
                <td>${t.weekNumber}</td>
                <td>${t.dayNumber}</td>
                <td>${t.topic.title}</td>
                <td>${t.topic.subcategory.category.name}</td>
                <td>${t.topic.subcategory.name}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }

  const filteredTasks = filterWeek === 'all' 
    ? tasks 
    : tasks.filter(t => t.weekNumber === parseInt(filterWeek));

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (!plan) {
    return <div className="card">Plan not found</div>;
  }

  const weeks = Array.from({ length: plan.totalWeeks }, (_, i) => i + 1);

  return (
    <div className="app-container">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plan: {plan.name}</h2>
        <button className="btn btn-outline" onClick={() => navigate('/admin/plans')}>
          Back to Plans
        </button>
      </div>

      {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>}

      {/* Plan Info */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Plan Information</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="subtext block mb-1">Plan Name</label>
            <input
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="subtext block mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="subtext block mb-1">Total Weeks</label>
            <input
              type="number"
              value={form.totalWeeks}
              onChange={e => setForm({...form, totalWeeks: parseInt(e.target.value) || 4})}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={updatePlan}>Update Plan</button>
      </div>

      {/* Export/Import Controls */}
      <div className="card mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={exportCSV}>Export CSV</button>
            <button className="btn btn-outline" onClick={exportJSON}>Export JSON</button>
            <button className="btn btn-outline" onClick={exportPDF}>Export PDF</button>
          </div>
          <div>
            <label className="btn btn-outline cursor-pointer">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          CSV Format: Week, Day, Topic Title
        </div>
      </div>

      {/* Task Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tasks ({tasks.length})</h3>
          <div className="flex gap-2">
            <select
              value={filterWeek}
              onChange={e => setFilterWeek(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Weeks</option>
              {weeks.map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={() => {
                cancelEdit();
                setShowTaskForm(!showTaskForm);
              }}
            >
              {showTaskForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {showTaskForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-3">{editingTask ? 'Edit Task' : 'Add New Task'}</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="subtext block mb-1">Topic</label>
                <select
                  value={taskForm.topicId}
                  onChange={e => setTaskForm({...taskForm, topicId: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Topic</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.subcategory?.category?.name || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="subtext block mb-1">Week Number</label>
                <input
                  type="number"
                  value={taskForm.weekNumber}
                  onChange={e => setTaskForm({...taskForm, weekNumber: parseInt(e.target.value) || 1})}
                  className="w-full p-2 border rounded"
                  min="1"
                  max={plan.totalWeeks}
                  required
                />
              </div>
              <div>
                <label className="subtext block mb-1">Day Number</label>
                <input
                  type="number"
                  value={taskForm.dayNumber}
                  onChange={e => setTaskForm({...taskForm, dayNumber: parseInt(e.target.value) || 1})}
                  className="w-full p-2 border rounded"
                  min="1"
                  max="7"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={editingTask ? updateTask : createTask}
              >
                {editingTask ? 'Update' : 'Create'}
              </button>
              <button className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Week</th>
                <th className="border p-2 text-left">Day</th>
                <th className="border p-2 text-left">Topic</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Subcategory</th>
                <th className="border p-2 text-left">Difficulty</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border p-4 text-center text-gray-500">
                    No tasks found. Add your first task above.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="border p-2">{task.weekNumber}</td>
                    <td className="border p-2">{task.dayNumber}</td>
                    <td className="border p-2">
                      <div className="font-medium">{task.topic.title}</div>
                      {task.topic.link && (
                        <a href={task.topic.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">
                          Link
                        </a>
                      )}
                    </td>
                    <td className="border p-2">{task.topic.subcategory?.category?.name || 'N/A'}</td>
                    <td className="border p-2">{task.topic.subcategory?.name || 'N/A'}</td>
                    <td className="border p-2">{task.topic.difficulty || '-'}</td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline text-xs"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline text-xs text-red-600"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
