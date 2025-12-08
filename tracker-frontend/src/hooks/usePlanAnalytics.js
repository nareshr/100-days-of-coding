// src/hooks/usePlanAnalytics.js
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { cachedFetch } from "../utils/cache";

/**
 * usePlanAnalytics(plan, opts)
 * - plan: userPlan object with id, startDate, totalWeeks
 * - returns: { totalTasks, completedTasks, percent, dayBuckets[], weeklyBuckets[] , loading, reload }
 *
 * dayBuckets: array of { date: 'YYYY-MM-DD', total, completed }
 */
export default function usePlanAnalytics(plan, { concurrency = 5 } = {}) {
  const [loading, setLoading] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [percent, setPercent] = useState(0);
  const [dayBuckets, setDayBuckets] = useState([]); // sorted ascending by date
  const [weeklyBuckets, setWeeklyBuckets] = useState([]);
  const [error, setError] = useState(null);

  const compute = useCallback(async () => {
    if (!plan || !plan.id) return;
    setLoading(true);
    setError(null);

    try {
      const weeks = plan.totalWeeks || 1;
      const weekNumbers = Array.from({ length: weeks }, (_, i) => i + 1);

      // batch the weeks for concurrency
      const batches = [];
      for (let i = 0; i < weekNumbers.length; i += concurrency) {
        batches.push(weekNumbers.slice(i, i + concurrency));
      }

      let total = 0;
      let done = 0;

      // map dateStr -> { total, completed }
      const dayMap = new Map();

      for (const batch of batches) {
        const promises = batch.map((w) =>
          // use cachedFetch to avoid repeated calls
          cachedFetch(`userplan:${plan.id}:week:${w}`, () =>
            API.get(`/userplans/${plan.id}/tasks?week=${w}`).then((r) => r.data)
          ).catch(() => [])
        );
        const results = await Promise.all(promises);
        results.forEach((tasks, idx) => {
          const weekNumber = batch[idx];
          tasks.forEach((t) => {
            total += 1;
            if (t.completed) done += 1;

            // compute absolute date from plan.startDate
            // day offset = (weekNumber-1)*7 + (dayNumber-1)
            const start = new Date(plan.startDate);
            const offsetDays = (weekNumber - 1) * 7 + (t.dayNumber - 1);
            const dt = new Date(start);
            dt.setDate(start.getDate() + offsetDays);
            const dateStr = dt.toISOString().slice(0, 10);

            const prev = dayMap.get(dateStr) || { total: 0, completed: 0 };
            prev.total += 1;
            if (t.completed) prev.completed += 1;
            dayMap.set(dateStr, prev);
          });

          // weekly aggregate
          const weekCompleted = tasks.filter((x) => x.completed).length;
          const weekTotal = tasks.length;
          // push to weeklyBuckets (we'll setState later)
          weeklyBuckets.push({ week: weekNumber, total: weekTotal, completed: weekCompleted });
        });

        // optimistic state update after each batch
        setTotalTasks(total);
        setCompletedTasks(done);
        setPercent(total ? Math.round((done / total) * 100) : 0);
      }

      // build dayBuckets sorted ascending
      const dayArr = Array.from(dayMap.entries()).map(([date, data]) => ({
        date,
        total: data.total,
        completed: data.completed
      }));
      dayArr.sort((a, b) => (a.date > b.date ? 1 : -1));

      setDayBuckets(dayArr);
      setWeeklyBuckets(weeklyBuckets);
      setTotalTasks(total);
      setCompletedTasks(done);
      setPercent(total ? Math.round((done / total) * 100) : 0);
    } catch (err) {
      console.error("usePlanAnalytics error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [plan, concurrency]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { totalTasks, completedTasks, percent, dayBuckets, weeklyBuckets, loading, error, reload: compute };
}
