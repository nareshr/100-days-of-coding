// WeeklyPlannerPolished.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import TaskCard from "../components/TaskCard";
import WeekSelector from "../components/WeekSelector";

export default function WeeklyPlannerPolished(){
  const planId = localStorage.getItem('currentPlanId');
  const [week, setWeek] = useState(1);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!planId) return;
    API.get(`/userplans/${planId}/tasks?week=${week}`).then(r => setTasks(r.data)).catch(console.error);
  }, [planId, week]);

  const toggle = async (t) => {
    if (!planId) return;
    if (t.completed) await API.post(`/userplans/${planId}/tasks/${t.id}/uncomplete`);
    else await API.post(`/userplans/${planId}/tasks/${t.id}/complete`);
    const r = await API.get(`/userplans/${planId}/tasks?week=${week}`);
    setTasks(r.data);
  };

  if (!user) {
    navigate("/login");
  }

  return (
    user ?
    <div className="app-container">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Weekly Planner — Week {week}</h2>
        <WeekSelector week={week} setWeek={setWeek} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {tasks.map(t => (
            <motion.div key={t.id} whileHover={{ scale: 1.01 }}>
              <TaskCard task={t} onToggle={() => toggle(t)} />
            </motion.div>
          ))}
        </div>

        <aside className="space-y-3">
          <div className="card">
            <div className="font-semibold mb-2">Week Summary</div>
            <div className="subtext">You have {tasks.length} tasks this week.</div>
          </div>

          <div className="card">
            <div className="font-semibold mb-2">Tips</div>
            <ul className="subtext list-disc ml-4">
              <li>Start with one easy problem to build momentum.</li>
              <li>Timebox practice: 45-90 mins per session.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div> : null
  );
}
