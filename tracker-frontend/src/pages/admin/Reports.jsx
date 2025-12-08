import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

// ProgressBar, Sparkline, TopicsBarChart helpers
function ProgressBar({ value = 0, max = 1, color = "#2563eb" }) {
  const percent = max === 0 ? 0 : Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div style={{
        width: `${percent}%`,
        background: color,
        height: "100%",
        transition: "width 0.4s cubic-bezier(.4,2,.3,1)"
      }} />
    </div>
  );
}
function Sparkline({ points, height = 36, color = "#16a34a" }) {
  if (!points || points.length < 2) return null;
  const max = Math.max(...points.map(p => p[1]));
  const min = Math.min(...points.map(p => p[1]));
  const range = Math.max(1, max - min);
  const w = Math.max(points.length - 1, 1) * 18;
  const path = points.reduce((acc, [x, y], i) => {
    const px = i * 18, py = height - ((y - min) / range) * (height - 4) - 2;
    return acc + (i === 0 ? `M${px},${py}` : ` L${px},${py}`);
  }, "");
  return (
    <svg width={w} height={height}>
      <polyline
        fill={color+"20"}
        stroke="none"
        points={points.map(([x,y],i) => `${i*18},${height-((y-min)/range)*(height-4)-2}`).join(" ") + ` ${w},${height} 0,${height}`}
      />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function TopicsBarChart({ data, color = "#2563eb" }) {
  const max = Math.max(1, ...data.map(d=>d.completedCount));
  return (
    <div className="space-y-2">
      {data.map((t,i) => (
        <div key={t.topicId} className="flex items-center gap-2">
          <div className="truncate w-48" title={t.title}>{t.title}</div>
          <div style={{
            flex: 1, background: "#e0e7ef", borderRadius: 8,
            overflow: "hidden", height: 14, marginRight: 8
          }}>
            <div style={{
              width: `${(t.completedCount / max) * 100}%`,
              background: color,
              height: "100%",
            }} />
          </div>
          <div className="text-xs text-gray-800 font-bold w-6">{t.completedCount}</div>
        </div>
      ))}
    </div>
  );
}

export default function Reports(){
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [weekNumber, setWeekNumber] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [summary, setSummary] = useState(null);
  const [weekReport, setWeekReport] = useState(null);
  const [categoryReport, setCategoryReport] = useState(null);
  const [daily, setDaily] = useState([]);
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");

  const loadUsers = useCallback(async () => {
    const r = await api.get("/admin/users");
    setUsers(r.data || []);
    if (r.data?.length) setSelectedUser(r.data[0].id);
  }, []);
  const loadCategories = useCallback(async () => {
    const r = await api.get("/categories");
    setCategories(r.data || []);
    if (r.data?.length) setSelectedCategory(r.data[0].name);
  }, []);
  const loadSummary = useCallback(async () => {
    const r = await api.get("/admin/reports/summary", { params: { userId: selectedUser }});
    setSummary(r.data);
  }, [selectedUser]);
  const loadWeek = useCallback(async () => {
    const r = await api.get(`/admin/reports/week/${weekNumber}`, { params: { userId: selectedUser }});
    setWeekReport(r.data);
  }, [selectedUser, weekNumber]);
  const loadCategory = useCallback(async () => {
    if (!selectedCategory) return;
    const r = await api.get(`/admin/reports/category/${encodeURIComponent(selectedCategory)}`, { params: { userId: selectedUser }});
    setCategoryReport(r.data);
  }, [selectedUser, selectedCategory]);
  const loadDaily = useCallback(async () => {
    const r = await api.get("/admin/reports/daily", { params: { userId: selectedUser }});
    setDaily(r.data || []);
  }, [selectedUser]);
  const loadTopics = useCallback(async () => {
    const r = await api.get("/admin/reports/topics", { params: { userId: selectedUser }});
    setTopics(r.data || []);
  }, [selectedUser]);

  useEffect(() => {
    const init = async () => {
      try {
        await loadUsers();
        await loadCategories();
      } catch (e) {
        console.error(e);
        setErr("Failed to load data");
      }
    };
    init();
  }, [loadUsers, loadCategories]);

  useEffect(() => {
    if (!selectedUser) return;
    const loadAll = async () => {
      try {
        await Promise.all([loadSummary(), loadWeek(), loadCategory(), loadDaily(), loadTopics()]);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("Failed to load reports");
      }
    };
    loadAll();
  }, [selectedUser, selectedCategory, weekNumber, loadSummary, loadWeek, loadCategory, loadDaily, loadTopics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Reports</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-2 border rounded">
            {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
          </select>
          <input type="number" value={weekNumber} min="1" onChange={e => setWeekNumber(parseInt(e.target.value) || 1)} className="p-2 border rounded w-24" />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 border rounded">
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {err && <div className="p-3 bg-red-100 text-red-700 rounded">{err}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="font-semibold mb-1">Summary</div>
          {summary ? (
            <>
              <div className="subtext mb-1">Completed: {summary.totalCompleted} / {summary.totalTasks}</div>
              <ProgressBar value={summary.totalCompleted} max={summary.totalTasks} color="#2563eb" />
            </>
          ) : <div className="subtext">Loading...</div>}
        </div>
        <div className="card">
          <div className="font-semibold mb-1">Week {weekNumber}</div>
          {weekReport ? (
            <>
              <div className="subtext mb-1">Completed: {weekReport.done} / {weekReport.total}</div>
              <ProgressBar value={weekReport.done} max={weekReport.total} color="#16a34a" />
            </>
          ) : <div className="subtext">Loading...</div>}
        </div>
        <div className="card">
          <div className="font-semibold mb-1">Category: {selectedCategory}</div>
          {categoryReport ? (
            <>
              <div className="subtext mb-1">Completed: {categoryReport.done} / {categoryReport.total}</div>
              <ProgressBar value={categoryReport.done} max={categoryReport.total} color="#eab308" />
            </>
          ) : <div className="subtext">Loading...</div>}
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Daily Completions</div>
        {daily.length === 0 ? (
          <div className="subtext">No data</div>
        ) : (
          <div className="pl-1">
            <Sparkline
              points={daily.map((d, i) => [i, d.completed])}
              color="#16a34a"
            />
            <div className="gap-2 text-xs flex flex-wrap mt-2">
              {daily.slice(-6).map(d => (
                <div key={d.date} className="pill">{d.date}: {d.completed}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Top Topics (completed)</div>
        {topics.length === 0 ? <div className="subtext">No data</div> : (
          <TopicsBarChart data={topics.slice(0, 12)} color="#2563eb" />
        )}
      </div>
    </div>
  );
}

// import React, { useEffect, useState, useCallback } from "react";
// import api from "../../services/api";

// export default function Reports(){
//   const [users, setUsers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [weekNumber, setWeekNumber] = useState(1);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [summary, setSummary] = useState(null);
//   const [weekReport, setWeekReport] = useState(null);
//   const [categoryReport, setCategoryReport] = useState(null);
//   const [daily, setDaily] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [err, setErr] = useState("");

//   const loadUsers = useCallback(async () => {
//     const r = await api.get("/admin/users");
//     setUsers(r.data || []);
//     if (r.data?.length) setSelectedUser(r.data[0].id);
//   }, []);

//   const loadCategories = useCallback(async () => {
//     const r = await api.get("/categories");
//     setCategories(r.data || []);
//     if (r.data?.length) setSelectedCategory(r.data[0].name);
//   }, []);

//   const loadSummary = useCallback(async () => {
//     const r = await api.get("/admin/reports/summary", { params: { userId: selectedUser }});
//     setSummary(r.data);
//   }, [selectedUser]);

//   const loadWeek = useCallback(async () => {
//     const r = await api.get(`/admin/reports/week/${weekNumber}`, { params: { userId: selectedUser }});
//     setWeekReport(r.data);
//   }, [selectedUser, weekNumber]);

//   const loadCategory = useCallback(async () => {
//     if (!selectedCategory) return;
//     const r = await api.get(`/admin/reports/category/${encodeURIComponent(selectedCategory)}`, { params: { userId: selectedUser }});
//     setCategoryReport(r.data);
//   }, [selectedUser, selectedCategory]);

//   const loadDaily = useCallback(async () => {
//     const r = await api.get("/admin/reports/daily", { params: { userId: selectedUser }});
//     setDaily(r.data || []);
//   }, [selectedUser]);

//   const loadTopics = useCallback(async () => {
//     const r = await api.get("/admin/reports/topics", { params: { userId: selectedUser }});
//     setTopics(r.data || []);
//   }, [selectedUser]);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         await loadUsers();
//         await loadCategories();
//       } catch (e) {
//         console.error(e);
//         setErr("Failed to load data");
//       }
//     };
//     init();
//   }, [loadUsers, loadCategories]);

//   useEffect(() => {
//     if (!selectedUser) return;
//     const loadAll = async () => {
//       try {
//         await Promise.all([loadSummary(), loadWeek(), loadCategory(), loadDaily(), loadTopics()]);
//         setErr("");
//       } catch (e) {
//         console.error(e);
//         setErr("Failed to load reports");
//       }
//     };
//     loadAll();
//   }, [selectedUser, selectedCategory, weekNumber, loadSummary, loadWeek, loadCategory, loadDaily, loadTopics]);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <h2 className="text-xl font-semibold">Reports</h2>
//         <div className="flex gap-2 flex-wrap items-center">
//           <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-2 border rounded">
//             {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
//           </select>
//           <input type="number" value={weekNumber} min="1" onChange={e => setWeekNumber(parseInt(e.target.value) || 1)} className="p-2 border rounded w-24" />
//           <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 border rounded">
//             {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
//           </select>
//         </div>
//       </div>

//       {err && <div className="p-3 bg-red-100 text-red-700 rounded">{err}</div>}

//       <div className="grid md:grid-cols-3 gap-4">
//         <div className="card">
//           <div className="font-semibold mb-1">Summary</div>
//           {summary ? (
//             <div className="subtext">Completed: {summary.totalCompleted} / {summary.totalTasks}</div>
//           ) : <div className="subtext">Loading...</div>}
//         </div>
//         <div className="card">
//           <div className="font-semibold mb-1">Week {weekNumber}</div>
//           {weekReport ? (
//             <div className="subtext">Completed: {weekReport.done} / {weekReport.total}</div>
//           ) : <div className="subtext">Loading...</div>}
//         </div>
//         <div className="card">
//           <div className="font-semibold mb-1">Category: {selectedCategory}</div>
//           {categoryReport ? (
//             <div className="subtext">Completed: {categoryReport.done} / {categoryReport.total}</div>
//           ) : <div className="subtext">Loading...</div>}
//         </div>
//       </div>

//       <div className="card">
//         <div className="font-semibold mb-2">Daily Completions</div>
//         {daily.length === 0 ? <div className="subtext">No data</div> : (
//           <div className="space-y-1 max-h-64 overflow-auto">
//             {daily.map(d => (
//               <div key={d.date} className="flex justify-between">
//                 <span className="subtext">{d.date}</span>
//                 <span className="font-medium">{d.completed}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="card">
//         <div className="font-semibold mb-2">Top Topics (completed)</div>
//         {topics.length === 0 ? <div className="subtext">No data</div> : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2 text-left">Title</th>
//                   <th className="border p-2 text-left">Category</th>
//                   <th className="border p-2 text-left">Subcategory</th>
//                   <th className="border p-2 text-left">Completed</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {topics.map(t => (
//                   <tr key={t.topicId} className="hover:bg-gray-50">
//                     <td className="border p-2">{t.title}</td>
//                     <td className="border p-2">{t.category}</td>
//                     <td className="border p-2">{t.subcategory}</td>
//                     <td className="border p-2">{t.completedCount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
