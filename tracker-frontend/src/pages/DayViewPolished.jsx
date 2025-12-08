// DayViewPolished.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";

export default function DayViewPolished(){
  const planId = localStorage.getItem('currentPlanId');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      if (!planId) return;
      const today = new Date().toISOString().slice(0,10);
      const res = await API.get(`/userplans/${planId}/tasksByDate?date=${today}`);
      setTasks(res.data);
    }
    load();
  }, [planId]);

  const toggle = async (t) => {
    if (t.completed) await API.post(`/userplans/${planId}/tasks/${t.id}/uncomplete`);
    else await API.post(`/userplans/${planId}/tasks/${t.id}/complete`);
    const today = new Date().toISOString().slice(0,10);
    const res = await API.get(`/userplans/${planId}/tasksByDate?date=${today}`);
    setTasks(res.data);
  };

  return (
    <div className="app-container">
      <h2 className="text-2xl font-semibold mb-4">Today</h2>

      <div className="space-y-3">
        {tasks.length === 0 && <div className="card subtext p-4">No tasks scheduled today.</div>}
        {tasks.map(t => <TaskCard key={t.id} task={t} onToggle={() => toggle(t)} />)}
      </div>
    </div>
  );
}
