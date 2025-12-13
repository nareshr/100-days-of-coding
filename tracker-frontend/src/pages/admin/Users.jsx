// src/pages/admin/Users.jsx
// src/pages/admin/Users.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/users", {
        params: { page, limit: 20 },
      });
      const data = r.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1);
      } else {
        setUsers(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/users/${editing.id}`, form);
        setEditing(null);
      } else {
        await api.post("/admin/users", form);
      }
      setForm({ name: "", email: "", role: "user", password: "" });
      setPage(1);
      await load();
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  }

  async function onEdit(u) {
    setEditing(u);
    const roleName = typeof u.role === "object" ? u.role?.name : u.role;
    setForm({
      name: u.name,
      email: u.email,
      role: roleName || "user",
      password: "",
    });
  }

  async function onDelete(u) {
    if (!confirm(`Delete ${u.email}?`)) return;
    await api.delete(`/admin/users/${u.id}`);
    await load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="subtext">Manage users and roles</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="subtext">Full name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="subtext">Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="subtext">Role</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="subtext">Password (only for create)</label>
              <input
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full p-2 border rounded"
                type="password"
              />
            </div>

            {err && <div className="text-red-500">{err}</div>}
            <div className="flex gap-2">
              <button className="btn btn-primary">
                {editing ? "Update" : "Create"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: "",
                      email: "",
                      role: "user",
                      password: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="font-semibold mb-3">User list</div>
            {loading ? (
              <div className="subtext">loading...</div>
            ) : (
              <>
                <div className="space-y-2">
                  {users.map((u) => {
                    const roleName =
                      typeof u.role === "object" ? u.role?.name : u.role;
                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded"
                      >
                        <div>
                          <div className="font-medium">
                            {u.name || u.email}
                          </div>
                          <div className="subtext">
                            {u.email} • {roleName || "user"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-outline"
                            onClick={() => onEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => onDelete(u)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
//   const [editing, setEditing] = useState(null);
//   const [err, setErr] = useState('');

//   async function load() {
//     setLoading(true);
//     try {
//       const r = await api.get('/admin/users');
//       setUsers(r.data || []);
//     } catch (e) {
//       console.error(e);
//     } finally { setLoading(false); }
//   }

//   useEffect(() => { load(); }, []);

//   async function submit(e) {
//     e.preventDefault();
//     try {
//       if (editing) {
//         await api.put(`/admin/users/${editing.id}`, form);
//         setEditing(null);
//       } else {
//         await api.post('/admin/users', form);
//       }
//       setForm({ name: '', email: '', role: 'user', password: '' });
//       await load();
//     } catch (err) {
//       setErr(err.response?.data?.error || err.message);
//     }
//   }

//   async function onEdit(u) {
//     setEditing(u);
//     const roleName = typeof u.role === 'object' ? u.role?.name : u.role;
//     setForm({ name: u.name, email: u.email, role: roleName || 'user', password: '' });
//   }

//   async function onDelete(u) {
//     if (!confirm(`Delete ${u.email}?`)) return;
//     await api.delete(`/admin/users/${u.id}`);
//     await load();
//   }

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Users</h2>
//         <div className="subtext">Manage users and roles</div>
//       </div>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="card">
//           <form onSubmit={submit} className="space-y-3">
//             <div>
//               <label className="subtext">Full name</label>
//               <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" />
//             </div>
//             <div>
//               <label className="subtext">Email</label>
//               <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded" />
//             </div>
//             <div>
//               <label className="subtext">Role</label>
//               <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full p-2 border rounded">
//                 <option value="user">User</option>
//                 <option value="manager">Manager</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <div>
//               <label className="subtext">Password (only for create)</label>
//               <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-2 border rounded" />
//             </div>

//             {err && <div className="text-red-500">{err}</div>}
//             <div className="flex gap-2">
//               <button className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
//               {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm({ name: '', email: '', role: 'user', password: '' }) }}>Cancel</button>}
//             </div>
//           </form>
//         </div>

//         <div className="md:col-span-2">
//           <div className="card">
//             <div className="font-semibold mb-3">User list</div>
//             {loading ? <div className="subtext">loading...</div> : (
//               <div className="space-y-2">
//                 {users.map(u => {
//                   const roleName = typeof u.role === 'object' ? u.role?.name : u.role;
//                   return (
//                     <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
//                       <div>
//                         <div className="font-medium">{u.name || u.email}</div>
//                         <div className="subtext">{u.email} • {roleName || 'user'}</div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="btn btn-outline" onClick={() => onEdit(u)}>Edit</button>
//                         <button className="btn btn-outline" onClick={() => onDelete(u)}>Delete</button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
