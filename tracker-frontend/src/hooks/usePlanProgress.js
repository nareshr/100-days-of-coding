import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

/**
 * Compute plan progress by fetching tasks for each week.
 * - plan: userPlan object { id, totalWeeks, name, startDate }
 * - concurrency: number of parallel HTTP requests (default 4)
 */
export default function usePlanProgress(plan, { concurrency = 4 } = {}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    percent: 0
  });
  const [error, setError] = useState(null);

  const compute = useCallback(async () => {
    if (!plan || !plan.id) return;
    setLoading(true);
    setError(null);

    try {
      const weeks = plan.totalWeeks || 1;
      const weeksArray = Array.from({ length: weeks }, (_, i) => i + 1);

      // concurrency helper
      const batches = [];
      for (let i = 0; i < weeksArray.length; i += concurrency) {
        batches.push(weeksArray.slice(i, i + concurrency));
      }

      let total = 0;
      let done = 0;

      for (const batch of batches) {
        const promises = batch.map((w) => API.get(`/userplans/${plan.id}/tasks?week=${w}`).then(r => r.data).catch(err => {
          console.error('week fetch error', w, err?.message || err);
          return [];
        }));
        const results = await Promise.all(promises);
        for (const tasks of results) {
          total += tasks.length;
          for (const t of tasks) {
            if (t.completed) done += 1;
          }
        }
        // optimistic update after each batch
        setProgress({
          totalTasks: total,
          completedTasks: done,
          percent: total ? Math.round((done / total) * 100) : 0
        });
      }

      setProgress({
        totalTasks: total,
        completedTasks: done,
        percent: total ? Math.round((done / total) * 100) : 0
      });
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [plan, concurrency]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { ...progress, loading, error, reload: compute };
}
