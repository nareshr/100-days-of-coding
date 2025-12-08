import { useEffect, useState } from "react";
import API from "../services/api";

export default function usePlanTasks(planId, week) {
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    if (!planId || !week) {
      // Do not call API until we have both values
      setTasks([]);
      return;
    }

    try {
      const response = await API.get(`/userplans/${planId}/tasks`, {
        params: { week },
      });
      setTasks(response.data || []);
    } catch (error) {
      console.error("Failed to load plan tasks", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    load();
  }, [planId, week]);

  return { tasks, reload: load };
}
