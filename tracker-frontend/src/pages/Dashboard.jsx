import React, { useEffect, useState } from "react";
import api from "../services/api";
import { cachedFetch } from "../utils/cache"; // Optional: you can copy the cachedFetch from previous messages, or simply call api directly
import PlanCard from "../components/ui/PlanCard";
import TodayBanner from "../components/ui/TodayBanner";
import HeatmapGrid from "../components/ui/HeatmapGrid";
import WeeklySummary from "../components/ui/WeeklySummary";
import DailyProgressWidget from "../components/ui/DailyProgressWidget";
import QuickActions from "../components/ui/QuickActions";

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(localStorage.getItem("currentPlanId") || null);
  const [analytics, setAnalytics] = useState({ totalTasks:0, completedTasks:0, percent:0, dayBuckets:[], weeklyBuckets:[] });
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load plans
  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      try {
        const r = await api.get("/userplans"); // expects array of user plans
        if (!mounted) return;
        setPlans(r.data || []);
        if (!currentPlanId && r.data && r.data.length) {
          const id = r.data[0].id;
          setCurrentPlanId(id);
          localStorage.setItem("currentPlanId", id);
        }
      } catch (err) {
        console.error("loadPlans", err);
      }
    }
    loadPlans();
    return () => { mounted = false; };
  }, []);

  // Load analytics for selected plan
  useEffect(() => {
    if (!currentPlanId) return;
    let mounted = true;
    async function loadAnalytics() {
      setLoading(true);
      try {
        // Preferred: server provides summary endpoint for plan analytics
        const summary = await api.get(`/userplans/${currentPlanId}/summary`); // { totalTasks, completedTasks, percent }
        const dayBuckets = await api.get(`/userplans/${currentPlanId}/dayBuckets`); // returns [{date, total, completed}, ...] last 90 days
        const weekly = await api.get(`/userplans/${currentPlanId}/weeklyBuckets`); // [{week, total, completed}...]

        if (!mounted) return;
        setAnalytics({
          totalTasks: summary.data.totalTasks || 0,
          completedTasks: summary.data.completedTasks || 0,
          percent: summary.data.percent || 0,
          dayBuckets: dayBuckets.data || [],
          weeklyBuckets: weekly.data || []
        });
      } catch (err) {
        // fallback: try aggregated endpoints used earlier
        console.error("analytics load err", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAnalytics();
    return () => { mounted = false; };
  }, [currentPlanId]);

  // Load today's tasks
  useEffect(() => {
    if (!currentPlanId) return;
    async function loadTodayTasks() {
      try {
        const today = new Date().toISOString().slice(0,10);
        const r = await api.get(`/userplans/${currentPlanId}/tasksByDate?date=${today}`); // returns array of tasks with topic included
        setTodayTasks(r.data || []);
      } catch (err) {
        console.error("loadTodayTasks", err);
      }
    }
    loadTodayTasks();
  }, [currentPlanId]);

  const openPlan = (plan) => {
    setCurrentPlanId(plan.id);
    localStorage.setItem("currentPlanId", plan.id);
  };

  const toggleTask = async (t) => {
    if (!currentPlanId) return;
    try {
      if (t.completed) await api.post(`/userplans/${currentPlanId}/tasks/${t.id}/uncomplete`);
      else await api.post(`/userplans/${currentPlanId}/tasks/${t.id}/complete`);
      // refresh today tasks and analytics
      const today = new Date().toISOString().slice(0,10);
      const r = await api.get(`/userplans/${currentPlanId}/tasksByDate?date=${today}`);
      setTodayTasks(r.data || []);
      const s = await api.get(`/userplans/${currentPlanId}/summary`);
      setAnalytics(a => ({ ...a, totalTasks: s.data.totalTasks, completedTasks: s.data.completedTasks, percent: s.data.percent }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="section">
        <TodayBanner dayStats={{ total: analytics.totalTasks, completed: analytics.completedTasks }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="section">
            <div className="section-title">Your Plans</div>
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map(p => (
                <PlanCard key={p.id} plan={p} progressPercent={p.id === currentPlanId ? analytics.percent : 0} onOpen={openPlan} />
              ))}
            </div>
          </div>

          <div className="section">
            <HeatmapGrid dayBuckets={analytics.dayBuckets} />
          </div>

          <div className="section">
            <WeeklySummary weekly={analytics.weeklyBuckets} />
          </div>
        </div>

        <aside className="space-y-6">
          <DailyProgressWidget dayStats={{ total: analytics.totalTasks, completed: analytics.completedTasks }} todayTasks={todayTasks} onToggle={toggleTask} />
          <QuickActions onOpenWeekly={() => window.location.href = "/weekly"} onOpenSpiritual={() => window.location.href = "/spiritual"} onOpenFitness={() => window.location.href = "/fitness"} />
        </aside>
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import API from "../services/api";
// import { cachedFetch } from "../utils/cache";
// import PlanCard from "./PlanCard";
// import Header from "../components/Header";
// import PlanSelectorDrawer from "../components/PlanSelectorDrawer";
// import DailyProgressWidget from "../components/DailyProgressWidget";
// import HeatmapGrid from "../components/HeatmapGrid";
// import WeeklySummary from "../components/WeeklySummary";
// import TodayBanner from "../components/TodayBanner";
// import usePlanAnalytics from "../hooks/usePlanAnalytics";
// import QuickActions from "../components/QuickActions";

// export default function Dashboard() {
//   const [plans, setPlans] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [currentPlanId, setCurrentPlanId] = useState(localStorage.getItem("currentPlanId") || null);
//   const [todayTasks, setTodayTasks] = useState([]);
//   const [loadingPlans, setLoadingPlans] = useState(true);

//   // Load plans
//   useEffect(() => {
//     async function load() {
//       setLoadingPlans(true);
//       const data = await cachedFetch("userplans", () =>
//         API.get("/userplans").then(r => r.data)
//       );
//       setPlans(data);

//       if (!currentPlanId && data.length) {
//         setCurrentPlanId(data[0].id);
//         localStorage.setItem("currentPlanId", data[0].id);
//       }
//       setLoadingPlans(false);
//     }
//     load();
//   }, []);

//   const currentPlan = plans.find(p => p.id === currentPlanId);
//   const analytics = usePlanAnalytics(currentPlan || {});

//   // Fetch today's tasks
//   useEffect(() => {
//     async function loadToday() {
//       if (!currentPlan) return;
//       const today = new Date().toISOString().slice(0, 10);
//       const tasks = await API.get(
//         `/userplans/${currentPlan.id}/tasksByDate?date=${today}`
//       ).then(r => r.data);
//       setTodayTasks(tasks);
//     }
//     loadToday();
//   }, [currentPlan]);

//   const todayDate = new Date().toISOString().slice(0, 10);
//   const todayBucket = analytics.dayBuckets.find(b => b.date === todayDate)
//     || { total: 0, completed: 0 };

//   return (
//     <div className="app-container">
//   <Header
//     title="Your Planner Dashboard"
//     subtitle="FAANG • Spiritual • Fitness — unified beautifully"
//     onSwitchPlan={() => setDrawerOpen(true)}
//     onRefresh={() => analytics.reload()}
//   />

//   <TodayBanner dayStats={todayBucket} />

//   <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
    
//     {/* LEFT SIDE */}
//     <div className="xl:col-span-2 space-y-10">

//       <section className="section">
//         <div className="section-title">Your Plans</div>
//         <div className="grid-gap grid-cols-1 md:grid-cols-2">
//         {plans.map(p => (
//                 <PlanCard
//                   key={p.id}
//                   plan={p}
//                   progressPercent={p.id === currentPlanId ? analytics.percent : 0}
//                   totalTasks={p.id === currentPlanId ? analytics.totalTasks : 0}
//                   completed={p.id === currentPlanId ? analytics.completedTasks : 0}
//                   onOpen={() => {
//                     localStorage.setItem("currentPlanId", p.id);
//                     window.location.href = "/weekly";
//                   }}
//                 />
//               ))}
//         </div>
//       </section>

//       <section className="section">
//         <HeatmapGrid buckets={analytics.dayBuckets} />
//       </section>

//       <section className="section">
//         <WeeklySummary weekly={analytics.weeklyBuckets} />
//       </section>

//     </div>

//     {/* RIGHT SIDE */}
//     <div className="space-y-10">

//       <section className="section">
//         <DailyProgressWidget
//           stats={todayBucket}
//           tasks={todayTasks}
//           onToggle={async (task) => {
//             try {
//               if (task.completed) {
//                 await API.post(`/userplans/${currentPlan.id}/tasks/${task.id}/uncomplete`);
//               } else {
//                 await API.post(`/userplans/${currentPlan.id}/tasks/${task.id}/complete`);
//               }
//             } finally {
//               analytics.reload();
//             }
//           }}
//         />
//       </section>

//       <section className="section">
//         <QuickActions
//           currentPlan={currentPlan}
//           onOpen={() => {
//             localStorage.setItem("currentPlanId", currentPlan.id);
//             window.location.href = "/weekly";
//           }}
//         />
//       </section>

//     </div>

//   </div>

//   <PlanSelectorDrawer
//         plans={plans}
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         onSelect={(p) => {
//           setCurrentPlanId(p.id);
//           localStorage.setItem("currentPlanId", p.id);
//         }}
//       />
// </div>
//   );
// }
