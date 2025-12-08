import React, { useState } from "react";
import useUserPlans from "../hooks/useUserPlans";
import usePlanTasks from "../hooks/usePlanTasks";
import TaskCard from "../components/TaskCard";
import API from "../services/api";

export default function DayView() {
  const plans = useUserPlans();
  const faangPlan = plans.find((p) => p.name.includes("FAANG"));
  
  const today = new Date();
  const dayIndex = today.getDay() + 1;
  const weekIndex = Math.floor((today.getDate() - 1) / 7) + 1;

  const { tasks, reload } = usePlanTasks(faangPlan?.id, weekIndex);
  const todayTasks = tasks.filter(t => t.dayNumber === dayIndex);

  const toggleTask = async (task) => {
    if (task.completed)
      await API.post(`/userplans/${faangPlan.id}/tasks/${task.id}/uncomplete`);
    else
      await API.post(`/userplans/${faangPlan.id}/tasks/${task.id}/complete`);
    reload();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Today's Plan</h1>

      <div className="space-y-3">
        {todayTasks.length === 0 && <div>No tasks scheduled today.</div>}
        {todayTasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </div>
    </div>
  );
}
