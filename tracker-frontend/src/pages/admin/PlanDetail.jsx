import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Topics paginated
  const [topics, setTopics] = useState([]);
  const [topicPage, setTopicPage] = useState(1);
  const [topicTotalPages, setTopicTotalPages] = useState(1);

  // Tasks paginated
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotalPages, setTaskTotalPages] = useState(1);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ name: "", startDate: "", totalWeeks: 4 });
  const [taskForm, setTaskForm] = useState({
    topicId: "",
    weekNumber: 1,
    dayNumber: 1,
  });

  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [filterWeek, setFilterWeek] = useState("all");

  // ----------------------------------------
  // LOADERS
  // ----------------------------------------

  const loadPlan = useCallback(async () => {
    try {
      const r = await api.get(`/admin/plans/${id}`);
      setPlan(r.data);

      const startDate = r.data.startDate
        ? new Date(r.data.startDate).toISOString().split("T")[0]
        : "";

      setForm({
        name: r.data.name || "",
        startDate,
        totalWeeks: r.data.totalWeeks || 4,
      });
    } catch (e) {
      console.error(e);
      setErr("Failed to load plan");
    }
  }, [id]);

  const loadTasks = useCallback(async () => {
    try {
      const r = await api.get(
        `/admin/plans/${id}/tasks?page=${taskPage}&limit=15`
      );

      setTasks(r.data.items);
      setTaskTotalPages(r.data.totalPages);
    } catch (e) {
      console.error(e);
      setErr("Failed to load tasks");
    }
  }, [id, taskPage]);

  const loadTopics = useCallback(async () => {
    if (!subcategoryId) {
      setTopics([]);
      return;
    }

    try {
      const r = await api.get(
        `/topics?page=${topicPage}&limit=20&subcategoryId=${subcategoryId}`
      );

      setTopics(r.data.items);
      setTopicTotalPages(r.data.totalPages);
    } catch (e) {
      console.error(e);
    }
  }, [subcategoryId, topicPage]);

  const loadCategories = useCallback(async () => {
    try {
      const r = await api.get(`/categories?page=1&limit=9999`);
      setCategories(r.data.items || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPlan(), loadTasks(), loadCategories()]).then(() =>
      setLoading(false)
    );
  }, []);

  // Reload tasks on page change
  useEffect(() => {
    loadTasks();
  }, [taskPage]);

  // Reload topics on subcategory or page change
  useEffect(() => {
    loadTopics();
  }, [subcategoryId, topicPage]);

  // ----------------------------------------
  // DERIVED OPTIONS
  // ----------------------------------------

  const subcategoryOptions = useMemo(() => {
    if (!categoryId) return [];
    const cat = categories.find((c) => String(c.id) === String(categoryId));
    return cat?.subcategories || [];
  }, [categoryId, categories]);

  // topicOptions removed – backend returns filtered topics already

  // ----------------------------------------
  // PLAN UPDATE
  // ----------------------------------------

  async function updatePlan() {
    try {
      await api.put(`/admin/plans/${id}`, form);
      await loadPlan();
      setErr("");
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  // ----------------------------------------
  // TASK HANDLING
  // ----------------------------------------

  function resetTaskForm() {
    setEditingTask(null);
    setTaskForm({ topicId: "", weekNumber: 1, dayNumber: 1 });
    setCategoryId("");
    setSubcategoryId("");
    setShowTaskForm(false);
    setErr("");
  }

  async function createTask() {
    if (!taskForm.topicId) {
      setErr("Please select category, subcategory and topic");
      return;
    }
    try {
      await api.post(`/admin/plans/${id}/tasks`, taskForm);
      await loadTasks();
      resetTaskForm();
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function updateTask() {
    if (!taskForm.topicId) {
      setErr("Please select category, subcategory and topic");
      return;
    }
    try {
      await api.put(`/admin/plans/${id}/tasks/${editingTask.id}`, taskForm);
      await loadTasks();
      resetTaskForm();
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/admin/plans/${id}/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  function startEdit(task) {
    setEditingTask(task);

    const cid = task.topic.subcategory?.category?.id || "";
    const sid = task.topic.subcategory?.id || "";

    setCategoryId(String(cid));
    setSubcategoryId(String(sid));

    setTaskForm({
      topicId: task.topicId,
      weekNumber: task.weekNumber,
      dayNumber: task.dayNumber,
    });

    setShowTaskForm(true);
  }

  function handleCategoryChange(e) {
    setCategoryId(e.target.value);
    setSubcategoryId("");
    setTopicPage(1);
    setTaskForm({ ...taskForm, topicId: "" });
  }

  function handleSubcategoryChange(e) {
    setSubcategoryId(e.target.value);
    setTopicPage(1);
    setTaskForm({ ...taskForm, topicId: "" });
  }

  // ----------------------------------------
  // PDF / CSV / JSON EXPORTS (unchanged)
  // ----------------------------------------
  async function handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
  
    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
  
    const startIndex = lines[0].toLowerCase().includes("week") ? 1 : 0;
  
    const tasksToImport = [];
  
    for (let i = startIndex; i < lines.length; i++) {
      const rawLine = lines[i].replace(/\r$/, "");
      const values = rawLine
        .split(",")
        .map(v => v.trim().replace(/^"|"$/g, ""));
  
      const weekNum = parseInt(values[0], 10);
      const dayNum = parseInt(values[1], 10);
      const categoryName = values[2];
      const subcategoryName = values[3];
      const topicTitle = values[4];
  
      if (!weekNum || !dayNum || !topicTitle) continue;
  
      // Instead of using local state 'topics', fetch the topic directly:
      let topicId = null;
  
      try {
        const resp = await api.get("/topics", {
          params: {
            q: topicTitle,      // search
            limit: 1,           // only need first match
            page: 1
          }
        });
  
        const items = resp.data.items || resp.data || [];
        const match = items.find(t => t.title === topicTitle);
  
        if (match) {
          topicId = match.id;
        }
      } catch (err) {
        console.error("Topic search failed for:", topicTitle);
      }
  
      if (topicId) {
        tasksToImport.push({
          topicId,
          weekNumber: weekNum,
          dayNumber: dayNum
        });
      }
    }
  
    if (tasksToImport.length === 0) {
      alert("No valid topics found in CSV.");
      e.target.value = "";
      return;
    }
  
    try {
      await api.post(`/admin/plans/${id}/tasks/bulk`, {
        tasks: tasksToImport
      });
      await loadTasks();
      setErr("");
      alert(`Imported ${tasksToImport.length} tasks successfully.`);
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.error || err.message);
    }
  
    e.target.value = "";
  }
  
  // async function handleImportCSV(e) {
  //   const file = e.target.files[0];
  //   // console.log(file)
  //   if (!file) return;

  //   const text = await file.text();
  //   const lines = text.split('\n').filter(l => l.trim());
  //   // console.log(lines)
  //   // Skip header row if present
  //   const startIndex = lines[0].toLowerCase().includes('week') ? 1 : 0;
    
  //   // Expected: Week, Day, Topic Title (or Topic ID)
  //   const tasksToImport = [];
  //   for (let i = startIndex; i < lines.length; i++) {
  //     // const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
  //     // const weekNum = parseInt(values[0]);
  //     // const dayNum = parseInt(values[1]);
  //     // const topicTitle = values[2];


  //     const rawLine = lines[i].replace(/\r$/, "");  // remove trailing \r safely
  //     const values = rawLine
  //       .split(',')
  //       .map(v => v.trim().replace(/^"|"$/g, ''));  // remove spaces + surrounding quotes

  //     const weekNum = parseInt(values[0], 10);
  //     const dayNum = parseInt(values[1], 10);
  //     const category = values[2] || "";
  //     const subcategory = values[3] || "";
  //     const topicTitle = (values[4] || "").replace(/\r/g, ""); // ensure no \r stays

  //     console.log(topics)
      
  //     // Find topic by title
  //     const topic = topics.find(t => t.title === topicTitle);
  //     if (topic && weekNum && dayNum) {
  //       tasksToImport.push({
  //         topicId: topic.id,
  //         weekNumber: weekNum,
  //         dayNumber: dayNum
  //       });
  //     }
  //   }

  //   console.log(tasksToImport)

  //   if (tasksToImport.length > 0) {
  //     try {
  //       await api.post(`/admin/plans/${id}/tasks/bulk`, { tasks: tasksToImport });
  //       await loadTasks();
  //       setErr('');
  //       alert(`Imported ${tasksToImport.length} tasks successfully`);
  //     } catch (err) {
  //       setErr(err.response?.data?.error || err.message);
  //     }
  //   }
  //   e.target.value = '';
  // }

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

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  if (loading) return <div className="card">Loading...</div>;
  if (!plan) return <div className="card">Plan not found</div>;

  const weeks = Array.from({ length: plan.totalWeeks }, (_, i) => i + 1);

  const filteredTasks =
    filterWeek === "all"
      ? tasks
      : tasks.filter((t) => t.weekNumber === parseInt(filterWeek, 10));

  return (
    <div className="app-container">

      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plan: {plan.name}</h2>
        <button
          className="btn btn-outline"
          onClick={() => navigate("/admin/plans")}
        >
          Back to Plans
        </button>
      </div>

      {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>}

      {/* PLAN INFO */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Plan Information</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="subtext block mb-1">Plan Name</label>
            <input
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="subtext block mb-1">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="subtext block mb-1">Total Weeks</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.totalWeeks}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalWeeks: parseInt(e.target.value, 10) || 1,
                })
              }
              min={1}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={updatePlan}>
          Update Plan
        </button>
      </div>

      {/* IMPORT / EXPORT */}
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

      {/* TASKS */}
      <div className="card">

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tasks</h3>

          <div className="flex gap-2">
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Weeks</option>
              {weeks.map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              {showTaskForm ? "Close" : "Add Task"}
            </button>
          </div>
        </div>

        {/* ADD/EDIT FORM */}
        {showTaskForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded">

            <h4 className="font-medium mb-3">
              {editingTask ? "Edit Task" : "Add Task"}
            </h4>

            <div className="grid md:grid-cols-3 gap-3">

              {/* CATEGORY */}
              <div>
                <label className="subtext block mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={categoryId}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBCATEGORY */}
              <div>
                <label className="subtext block mb-1">Subcategory</label>
                <select
                  className="w-full p-2 border rounded"
                  value={subcategoryId}
                  onChange={handleSubcategoryChange}
                  disabled={!categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TOPIC */}
              <div>
                <label className="subtext block mb-1">Topic</label>
                <select
                  className="w-full p-2 border rounded"
                  disabled={!subcategoryId}
                  value={taskForm.topicId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, topicId: e.target.value })
                  }
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>

                {/* TOPIC PAGINATION */}
                {topicTotalPages > 1 && (
                  <div className="flex gap-2 mt-2 text-sm">
                    <button
                      className="btn btn-outline"
                      disabled={topicPage === 1}
                      onClick={() => setTopicPage(topicPage - 1)}
                    >
                      Prev
                    </button>

                    <span>
                      Page {topicPage} / {topicTotalPages}
                    </span>

                    <button
                      className="btn btn-outline"
                      disabled={topicPage === topicTotalPages}
                      onClick={() => setTopicPage(topicPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* WEEK */}
              <div>
                <label className="subtext block mb-1">Week</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={taskForm.weekNumber}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      weekNumber: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  min={1}
                  max={plan.totalWeeks}
                />
              </div>

              {/* DAY */}
              <div>
                <label className="subtext block mb-1">Day</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={taskForm.dayNumber}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      dayNumber: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  min={1}
                  max={7}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                className="btn btn-primary"
                onClick={editingTask ? updateTask : createTask}
              >
                {editingTask ? "Update" : "Create"}
              </button>
              <button className="btn btn-outline" onClick={resetTaskForm}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* TASK TABLE */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Week</th>
                <th className="border p-2">Day</th>
                <th className="border p-2">Topic</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Difficulty</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-4 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="border p-2">{task.weekNumber}</td>
                    <td className="border p-2">{task.dayNumber}</td>
                    <td className="border p-2">
                      <div className="font-medium">{task.topic.title}</div>
                      {task.topic.link && (
                        <a
                          href={task.topic.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600"
                        >
                          Link
                        </a>
                      )}
                    </td>
                    <td className="border p-2">
                      {task.topic.subcategory.category.name}
                    </td>
                    <td className="border p-2">{task.topic.subcategory.name}</td>
                    <td className="border p-2">
                      {task.topic.difficulty || "-"}
                    </td>

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

          {/* TASK PAGINATION */}
          {taskTotalPages > 1 && (
            <div className="flex gap-3 mt-3 text-sm">
              <button
                className="btn btn-outline"
                disabled={taskPage === 1}
                onClick={() => setTaskPage(taskPage - 1)}
              >
                Prev
              </button>

              <span>
                Page {taskPage} / {taskTotalPages}
              </span>

              <button
                className="btn btn-outline"
                disabled={taskPage === taskTotalPages}
                onClick={() => setTaskPage(taskPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
