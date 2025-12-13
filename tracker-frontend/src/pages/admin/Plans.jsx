import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    totalWeeks: 4,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    const r = await api.get("/admin/plans", {
      params: { page, limit: 10 },
    });
    const data = r.data;
    if (Array.isArray(data)) {
      setPlans(data);
      setTotalPages(1);
    } else {
      setPlans(data.items || []);
      setTotalPages(data.totalPages || 1);
    }
  }, [page]);

  async function create() {
    await api.post("/admin/plans", form);
    setForm({ name: "", startDate: "", totalWeeks: 4 });
    setPage(1);
    await load();
  }

  async function del(id) {
    await api.delete(`/admin/plans/${id}`);
    await load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Plans</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Create Plan */}
        <div className="card space-y-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={form.totalWeeks}
            onChange={(e) =>
              setForm({
                ...form,
                totalWeeks: parseInt(e.target.value, 10) || 1,
              })
            }
            className="w-full p-2 border rounded"
          />
          <div className="mt-3">
            <button className="btn btn-primary" onClick={create}>
              Create
            </button>
          </div>
        </div>

        {/* Plans List */}
        <div className="md:col-span-2 card">
          <div className="space-y-2">
            {plans.map((p) => {
              const startDate = p.startDate
                ? new Date(p.startDate).toLocaleDateString()
                : "N/A";
              return (
                <div
                  key={p.id}
                  className="flex justify-between p-2 bg-slate-50 rounded"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="subtext">
                      {p.totalWeeks} weeks · {startDate}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/admin/plans/${p.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline text-xs"
                      onClick={async () => {
                        try {
                          const response = await api.get(
                            `/admin/plans/${p.id}/export/csv`,
                            { responseType: "text" }
                          );
                          const blob = new Blob([response.data], {
                            type: "text/csv;charset=utf-8;",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `plan-${p.name}-${Date.now()}.csv`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error("Failed to export CSV", error);
                          alert("Failed to export CSV");
                        }
                      }}
                      title="Export CSV"
                    >
                      CSV
                    </button>
                    <button
                      className="btn btn-outline text-xs"
                      onClick={async () => {
                        try {
                          const response = await api.get(
                            `/admin/plans/${p.id}/export/json`
                          );
                          const blob = new Blob(
                            [JSON.stringify(response.data, null, 2)],
                            { type: "application/json" }
                          );
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `plan-${p.name}-${Date.now()}.json`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error("Failed to export JSON", error);
                          alert("Failed to export JSON");
                        }
                      }}
                      title="Export JSON"
                    >
                      JSON
                    </button>
                    <button
                      className="btn btn-outline text-red-600"
                      onClick={() => del(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-3 mt-4 items-center text-sm">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// export default function Plans(){
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);
//   const [form, setForm] = useState({ name: '', startDate: '', totalWeeks: 4 });
  
//   const load = useCallback(async () => {
//     const r = await api.get('/admin/plans');
//     setPlans(r.data || []);
//   }, []);
  
//   async function create(){ 
//     await api.post('/admin/plans', form); 
//     setForm({ name: '', startDate: '', totalWeeks: 4 }); 
//     await load(); 
//   }
  
//   async function del(id){ 
//     await api.delete(`/admin/plans/${id}`); 
//     await load(); 
//   }
  
//   useEffect(() => { 
//     load(); 
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Plans</h2>
//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="card">
//           <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" />
//           <input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="w-full p-2 border rounded mt-2" />
//           <input type="number" value={form.totalWeeks} onChange={e=>setForm({...form, totalWeeks: parseInt(e.target.value)})} className="w-full p-2 border rounded mt-2" />
//           <div className="mt-3"><button className="btn btn-primary" onClick={create}>Create</button></div>
//         </div>

//         <div className="md:col-span-2 card">
//           <div className="space-y-2">
//             {plans.map(p => {
//               const startDate = p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A';
//               return (
//                 <div key={p.id} className="flex justify-between p-2 bg-slate-50 rounded">
//                   <div>
//                     <div className="font-medium">{p.name}</div>
//                     <div className="subtext">{p.totalWeeks} weeks · {startDate}</div>
//                   </div>
//                   <div className="flex gap-2 flex-wrap">
//                     <button className="btn btn-outline" onClick={() => navigate(`/admin/plans/${p.id}`)}>Edit</button>
//                     <button 
//                       className="btn btn-outline text-xs" 
//                       onClick={async () => {
//                         try {
//                           const response = await api.get(`/admin/plans/${p.id}/export/csv`, {
//                             responseType: 'text'
//                           });
//                           const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
//                           const url = window.URL.createObjectURL(blob);
//                           const link = document.createElement('a');
//                           link.href = url;
//                           link.download = `plan-${p.name}-${Date.now()}.csv`;
//                           document.body.appendChild(link);
//                           link.click();
//                           document.body.removeChild(link);
//                           window.URL.revokeObjectURL(url);
//                         } catch (error) {
//                           console.error('Failed to export CSV', error);
//                           alert('Failed to export CSV');
//                         }
//                       }}
//                       title="Export CSV"
//                     >
//                       CSV
//                     </button>
//                     <button 
//                       className="btn btn-outline text-xs" 
//                       onClick={async () => {
//                         try {
//                           const response = await api.get(`/admin/plans/${p.id}/export/json`);
//                           const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
//                           const url = window.URL.createObjectURL(blob);
//                           const link = document.createElement('a');
//                           link.href = url;
//                           link.download = `plan-${p.name}-${Date.now()}.json`;
//                           document.body.appendChild(link);
//                           link.click();
//                           document.body.removeChild(link);
//                           window.URL.revokeObjectURL(url);
//                         } catch (error) {
//                           console.error('Failed to export JSON', error);
//                           alert('Failed to export JSON');
//                         }
//                       }}
//                       title="Export JSON"
//                     >
//                       JSON
//                     </button>
//                     <button className="btn btn-outline text-red-600" onClick={() => del(p.id)}>Delete</button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
