import React, { useState } from "react";
import useUserPlans from "../hooks/useUserPlans";
import usePlanTasks from "../hooks/usePlanTasks";
import TaskCard from "../components/TaskCard";
import WeekSelector from "../components/WeekSelector";
import API from "../services/api";

export default function WeeklyPlanner() {
  const plans = useUserPlans();
  const faangPlan = plans.find((p) => p.name.includes("FAANG"));
  
  const [week, setWeek] = useState(1);
  const { tasks, reload } = usePlanTasks(faangPlan?.id, week);

  const toggleTask = async (task) => {
    if (task.completed)
      await API.post(`/userplans/${faangPlan.id}/tasks/${task.id}/uncomplete`);
    else
      await API.post(`/userplans/${faangPlan.id}/tasks/${task.id}/complete`);
    reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">FAANG Weekly Planner</h1>

      <WeekSelector week={week} setWeek={setWeek} />

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </div>
    </div>
  );
}
