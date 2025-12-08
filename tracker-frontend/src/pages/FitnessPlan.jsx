import React, { useState } from "react";
import useUserPlans from "../hooks/useUserPlans";
import usePlanTasks from "../hooks/usePlanTasks";
import TaskCard from "../components/TaskCard";
import WeekSelector from "../components/WeekSelector";
import API from "../services/api";
import { FaDumbbell, FaHeartbeat, FaBicycle } from "react-icons/fa";

export default function FitnessPlan(){
  const plans = useUserPlans();
  const plan = plans.find((p) => p.name.includes("Fitness"));
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
      <div className="rounded-2xl p-6 bg-gradient-to-r from-orange-500/90 to-pink-500 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fitness Planner</h1>
          <p className="text-sm text-orange-50">Strength, stamina, and recovery</p>
        </div>
        <div className="text-4xl"><FaDumbbell /></div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card bg-orange-50">
          <div className="flex items-center gap-2 font-semibold text-orange-700"><FaHeartbeat /> Balance</div>
          <div className="subtext">Mix cardio, strength, and mobility.</div>
        </div>
        <div className="card bg-orange-50">
          <div className="flex items-center gap-2 font-semibold text-orange-700"><FaBicycle /> Progress</div>
          <div className="subtext">Small increments each week.</div>
        </div>
        <div className="card bg-orange-50">
          <div className="flex items-center gap-2 font-semibold text-orange-700"><FaDumbbell /> Recovery</div>
          <div className="subtext">Sleep, hydration, and rest days.</div>
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
