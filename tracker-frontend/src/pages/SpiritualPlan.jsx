import React, { useState } from "react";
import useUserPlans from "../hooks/useUserPlans";
import usePlanTasks from "../hooks/usePlanTasks";
import TaskCard from "../components/TaskCard";
import WeekSelector from "../components/WeekSelector";
import API from "../services/api";
import { FaLeaf, FaPray, FaBookOpen } from "react-icons/fa";

export default function SpiritualPlan(){
  const plans = useUserPlans();
  const plan = plans.find((p) => p.name.includes("Spiritual"));
  const [week, setWeek] = useState(1);
  const { tasks, reload } = usePlanTasks(plan?.id, week);

  const toggleTask = async (t) => {
    if (t.completed)
      await API.post(`/userplans/${plan.id}/tasks/${t.id}/uncomplete`);
    else
      await API.post(`/userplans/${plan.id}/tasks/${t.id}/complete`);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-500/90 to-emerald-600 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Spiritual Planner</h1>
          <p className="text-sm text-emerald-50">Mindfulness, devotion, and reflection</p>
        </div>
        <div className="text-4xl"><FaPray /></div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card bg-emerald-50">
          <div className="flex items-center gap-2 font-semibold text-emerald-700"><FaLeaf /> Consistency</div>
          <div className="subtext">Aim for daily calm sessions.</div>
        </div>
        <div className="card bg-emerald-50">
          <div className="flex items-center gap-2 font-semibold text-emerald-700"><FaBookOpen /> Learning</div>
          <div className="subtext">Blend reading, chanting, and reflection.</div>
        </div>
        <div className="card bg-emerald-50">
          <div className="flex items-center gap-2 font-semibold text-emerald-700"><FaPray /> Presence</div>
          <div className="subtext">Short, focused sessions beat long distracted ones.</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <WeekSelector week={week} setWeek={setWeek} />
        {plan && <div className="subtext">Plan: {plan.name}</div>}
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onToggle={toggleTask} />
        ))}
        {tasks.length === 0 && <div className="card">No tasks for this week.</div>}
      </div>
    </div>
  );
}
