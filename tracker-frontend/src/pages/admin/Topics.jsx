import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../services/api";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filters
  const [filter, setFilter] = useState({
    q: "",
    categoryId: "",
    subcategoryId: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form (create / edit topic)
  const [form, setForm] = useState({
    id: null,
    title: "",
    categoryId: "",
    subcategoryId: "",
    difficulty: "",
    type: "",
    link: "",
    estimatedTime: "",
  });

  // -----------------------------
  // Derived subcategory options
  // -----------------------------
  const subcategoryOptions = useMemo(() => {
    const catId = form.categoryId || filter.categoryId;
    if (!catId) return [];
    const cat = categories.find((c) => String(c.id) === String(catId));
    return cat ? cat.subcategories || [] : [];
  }, [form.categoryId, filter.categoryId, categories]);

  // -----------------------------
  // Loaders
  // -----------------------------
  const loadCategories = useCallback(async () => {
    // Support both paginated and non-paginated /categories
    const r = await api.get("/categories", { params: { page: 1, limit: 9999 } });
    const data = r.data;
    const items = Array.isArray(data) ? data : data.items || [];
    setCategories(items);
  }, []);

  const loadTopics = useCallback(async () => {
    const params = {
      page,
      limit: 20,
    };

    if (filter.q) params.q = filter.q;
    if (filter.subcategoryId) params.subcategoryId = filter.subcategoryId;
    if (filter.categoryId) params.categoryId = filter.categoryId;

    const r = await api.get("/topics", { params });
    const data = r.data;

    // Support both array and paginated formats
    if (Array.isArray(data)) {
      setTopics(data);
      setTotalPages(1);
    } else {
      setTopics(data.items || []);
      setTotalPages(data.totalPages || 1);
    }
  }, [page, filter.q, filter.categoryId, filter.subcategoryId]);

  // load categories once
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await loadCategories();
        await loadTopics();
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("Failed to load topics or categories");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reload topics when filters or page change
  useEffect(() => {
    if (loading) return;
    const fetchTopics = async () => {
      try {
        await loadTopics();
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("Failed to load topics");
      }
    };
    fetchTopics();
  }, [page, filter.q, filter.categoryId, filter.subcategoryId, loadTopics, loading]);

  async function refresh() {
    await loadTopics();
  }

  // -----------------------------
  // CRUD handlers
  // -----------------------------
  function onEdit(t) {
    setForm({
      id: t.id,
      title: t.title,
      categoryId: t.subcategory?.category?.id || "",
      subcategoryId: t.subcategory?.id || "",
      difficulty: t.difficulty || "",
      type: t.type || "",
      link: t.link || "",
      estimatedTime: t.estimatedTime || "",
    });
  }

  function resetForm() {
    setForm({
      id: null,
      title: "",
      categoryId: "",
      subcategoryId: "",
      difficulty: "",
      type: "",
      link: "",
      estimatedTime: "",
    });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      if (!form.title || !form.subcategoryId) {
        setErr("Title and Subcategory are required");
        return;
      }
      const payload = {
        title: form.title,
        subcategoryId: form.subcategoryId,
        difficulty: form.difficulty || undefined,
        type: form.type || undefined,
        link: form.link || undefined,
        estimatedTime: form.estimatedTime ? Number(form.estimatedTime) : undefined,
      };
      if (form.id) {
        await api.put(`/topics/${form.id}`, payload);
      } else {
        await api.post(`/topics`, payload);
      }
      resetForm();
      setErr("");
      // after save, go to first page to see new item
      setPage(1);
      await refresh();
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || error.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this topic?")) return;
    try {
      await api.delete(`/topics/${id}`);
      await refresh();
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || error.message);
    }
  }

  // -----------------------------
  // Import / Export
  // -----------------------------
  async function handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    const startIndex = lines[0].toLowerCase().includes("title") ? 1 : 0;

    const toSend = [];
    for (let i = startIndex; i < lines.length; i++) {
      const [title, , subcategoryName, difficulty, type, estimatedTime, link] =
        lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
      if (!title || !subcategoryName) continue;
      // find subcategory id by name
      let subId = "";
      for (const c of categories) {
        const sub = (c.subcategories || []).find((s) => s.name === subcategoryName);
        if (sub) {
          subId = sub.id;
          break;
        }
      }
      if (!subId) continue;
      toSend.push({
        title,
        subcategoryId: subId,
        difficulty: difficulty || undefined,
        type: type || undefined,
        estimatedTime: estimatedTime ? Number(estimatedTime) : undefined,
        link: link || undefined,
      });
    }
    if (!toSend.length) {
      setErr("No valid topics in CSV");
      e.target.value = "";
      return;
    }
    try {
      await api.post("/topics/import", { topics: toSend });
      setPage(1);
      await refresh();
      setErr("");
      alert(`Imported ${toSend.length} topics`);
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || error.message);
    } finally {
      e.target.value = "";
    }
  }

  async function exportCSV() {
    try {
      const response = await api.get("/topics/export/csv", {
        responseType: "text",
      });
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `topics-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErr("Failed to export CSV");
    }
  }

  async function exportJSON() {
    try {
      const response = await api.get("/topics/export/json");
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `topics-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErr("Failed to export JSON");
    }
  }

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Topics</h2>
        <div className="flex gap-2 flex-wrap">
          <label className="btn btn-outline cursor-pointer">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button className="btn btn-outline" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn btn-outline" onClick={exportJSON}>
            Export JSON
          </button>
        </div>
      </div>

      {err && <div className="p-3 bg-red-100 text-red-700 rounded">{err}</div>}

      {/* Create / Edit Form */}
      <div className="card">
        <h3 className="font-semibold mb-3">
          {form.id ? "Edit Topic" : "Create Topic"}
        </h3>
        <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="subtext block mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="subtext block mb-1">Category (sets Type)</label>
            <select
              value={form.categoryId}
              onChange={(e) => {
                const catId = e.target.value;
                const cat = categories.find((c) => String(c.id) === String(catId));
                setForm({
                  ...form,
                  categoryId: catId,
                  subcategoryId: "",
                  type: cat?.type || "",
                });
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.type ? `(${c.type})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="subtext block mb-1">Subcategory</label>
            <select
              value={form.subcategoryId}
              onChange={(e) =>
                setForm({ ...form, subcategoryId: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Subcategory</option>
              {subcategoryOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="subtext block mb-1">Difficulty</label>
            <input
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="subtext block mb-1">Type</label>
            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="subtext block mb-1">Estimated Time (minutes)</label>
            <input
              type="number"
              value={form.estimatedTime}
              onChange={(e) =>
                setForm({ ...form, estimatedTime: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="subtext block mb-1">Link</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button className="btn btn-primary">
              {form.id ? "Update" : "Create"}
            </button>
            {form.id && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter + List */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-semibold">Topic List ({topics.length})</h3>
          <div className="flex gap-2 flex-wrap">
            <select
              className="p-2 border rounded"
              value={filter.categoryId}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  categoryId: e.target.value,
                  subcategoryId: "",
                });
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded"
              value={filter.subcategoryId}
              onChange={(e) => {
                setFilter({ ...filter, subcategoryId: e.target.value });
                setPage(1);
              }}
              disabled={!filter.categoryId}
            >
              <option value="">All Subcategories</option>
              {subcategoryOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Search by title..."
              value={filter.q}
              onChange={(e) => {
                setFilter({ ...filter, q: e.target.value });
                setPage(1);
              }}
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Subcategory</th>
                <th className="border p-2 text-left">Difficulty</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="border p-4 text-center text-gray-500"
                  >
                    No topics found.
                  </td>
                </tr>
              ) : (
                topics.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <div className="font-medium">{t.title}</div>
                      {t.link && (
                        <a
                          href={t.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600"
                        >
                          Link
                        </a>
                      )}
                    </td>
                    <td className="border p-2">
                      {t.subcategory?.category?.name || "N/A"}
                    </td>
                    <td className="border p-2">
                      {t.subcategory?.name || "N/A"}
                    </td>
                    <td className="border p-2">{t.difficulty || "-"}</td>
                    <td className="border p-2">{t.type || "-"}</td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline text-xs"
                          onClick={() => onEdit(t)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline text-xs text-red-600"
                          onClick={() => remove(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-3 mt-3 items-center text-sm">
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
  );
}



// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import api from "../../services/api";

// export default function Topics() {
//   const [topics, setTopics] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [filter, setFilter] = useState({ q: "", categoryId: "", subcategoryId: "" });
//   const [form, setForm] = useState({
//     id: null,
//     title: "",
//     categoryId: "",
//     subcategoryId: "",
//     difficulty: "",
//     type: "",
//     link: "",
//     estimatedTime: "",
//   });

//   const subcategoryOptions = useMemo(() => {
//     const catId = form.categoryId || filter.categoryId;
//     if (!catId) return [];
//     const cat = categories.find(c => c.id === catId);
//     return cat ? cat.subcategories : [];
//   }, [form.categoryId, filter.categoryId, categories]);

//   const loadCategories = useCallback(async () => {
//     const r = await api.get("/categories");
//     setCategories(r.data || []);
//   }, []);

//   const loadTopics = useCallback(async () => {
//     const params = {};
//     if (filter.q) params.q = filter.q;
//     if (filter.subcategoryId) params.subcategory = filter.subcategoryId;
//     if (filter.categoryId) {
//       const cat = categories.find(c => c.id === filter.categoryId);
//       if (cat) params.category = cat.name;
//     }
//     const r = await api.get(`/topics?limit=20&page=${page}&subcategoryId=${subcategoryId || ""}`, { params });
//     setTopics(r.data || []);
//   }, [filter.q, filter.subcategoryId, filter.categoryId, categories]);

//   // load categories once
//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         await loadCategories();
//       } catch (e) {
//         console.error(e);
//         setErr("Failed to load categories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, [loadCategories]);

//   // load topics when filters or categories ready
//   useEffect(() => {
//     if (categories.length === 0 && !filter.categoryId && !filter.subcategoryId && !filter.q) {
//       // avoid firing before categories fetch completes unless filters change
//       return;
//     }
//     const fetchTopics = async () => {
//       try {
//         await loadTopics();
//         setErr("");
//       } catch (e) {
//         console.error(e);
//         setErr("Failed to load topics");
//       }
//     };
//     fetchTopics();
//   }, [categories.length, filter.q, filter.categoryId, filter.subcategoryId, loadTopics]);

//   async function refresh() {
//     await loadTopics();
//   }

//   function onEdit(t) {
//     setForm({
//       id: t.id,
//       title: t.title,
//       categoryId: t.subcategory?.category?.id || "",
//       subcategoryId: t.subcategory?.id || "",
//       difficulty: t.difficulty || "",
//       type: t.type || "",
//       link: t.link || "",
//       estimatedTime: t.estimatedTime || "",
//     });
//   }

//   function resetForm() {
//     setForm({
//       id: null,
//       title: "",
//       categoryId: "",
//       subcategoryId: "",
//       difficulty: "",
//       type: "",
//       link: "",
//       estimatedTime: "",
//     });
//   }

//   async function submit(e) {
//     e.preventDefault();
//     try {
//       if (!form.title || !form.subcategoryId) {
//         setErr("Title and Subcategory are required");
//         return;
//       }
//       const payload = {
//         title: form.title,
//         subcategoryId: form.subcategoryId,
//         difficulty: form.difficulty || undefined,
//         type: form.type || undefined,
//         link: form.link || undefined,
//         estimatedTime: form.estimatedTime ? Number(form.estimatedTime) : undefined,
//       };
//       if (form.id) {
//         await api.put(`/topics/${form.id}`, payload);
//       } else {
//         await api.post(`/topics`, payload);
//       }
//       resetForm();
//       setErr("");
//       await refresh();
//     } catch (error) {
//       console.error(error);
//       setErr(error.response?.data?.error || error.message);
//     }
//   }

//   async function remove(id) {
//     if (!confirm("Delete this topic?")) return;
//     try {
//       await api.delete(`/topics/${id}`);
//       await refresh();
//     } catch (error) {
//       console.error(error);
//       setErr(error.response?.data?.error || error.message);
//     }
//   }

//   async function handleImportCSV(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const text = await file.text();
//     const lines = text.split("\n").filter(l => l.trim());
//     const startIndex = lines[0].toLowerCase().includes("title") ? 1 : 0;

//     const toSend = [];
//     for (let i = startIndex; i < lines.length; i++) {
//       const [title, , subcategoryName, difficulty, type, estimatedTime, link] =
//         lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
//       if (!title || !subcategoryName) continue;
//       // find subcategory id by name
//       let subId = "";
//       for (const c of categories) {
//         const sub = c.subcategories.find(s => s.name === subcategoryName);
//         if (sub) { subId = sub.id; break; }
//       }
//       if (!subId) continue;
//       toSend.push({
//         title,
//         subcategoryId: subId,
//         difficulty: difficulty || undefined,
//         type: type || undefined,
//         estimatedTime: estimatedTime ? Number(estimatedTime) : undefined,
//         link: link || undefined,
//       });
//     }
//     if (!toSend.length) {
//       setErr("No valid topics in CSV");
//       e.target.value = "";
//       return;
//     }
//     try {
//       await api.post("/topics/import", { topics: toSend });
//       await refresh();
//       setErr("");
//       alert(`Imported ${toSend.length} topics`);
//     } catch (error) {
//       console.error(error);
//       setErr(error.response?.data?.error || error.message);
//     } finally {
//       e.target.value = "";
//     }
//   }

//   async function exportCSV() {
//     try {
//       const response = await api.get("/topics/export/csv", { responseType: "text" });
//       const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `topics-${Date.now()}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error(error);
//       setErr("Failed to export CSV");
//     }
//   }

//   async function exportJSON() {
//     try {
//       const response = await api.get("/topics/export/json");
//       const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `topics-${Date.now()}.json`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error(error);
//       setErr("Failed to export JSON");
//     }
//   }

//   if (loading) return <div className="card">Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Topics</h2>
//         <div className="flex gap-2 flex-wrap">
//           <label className="btn btn-outline cursor-pointer">
//             Import CSV
//             <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
//           </label>
//           <button className="btn btn-outline" onClick={exportCSV}>Export CSV</button>
//           <button className="btn btn-outline" onClick={exportJSON}>Export JSON</button>
//         </div>
//       </div>

//       {err && <div className="p-3 bg-red-100 text-red-700 rounded">{err}</div>}

//       <div className="card">
//         <h3 className="font-semibold mb-3">{form.id ? "Edit Topic" : "Create Topic"}</h3>
//         <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
//           <div>
//             <label className="subtext block mb-1">Title</label>
//             <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" required />
//           </div>
//           <div>
//             <label className="subtext block mb-1">Category (sets Type)</label>
//             <select
//               value={form.categoryId}
//               onChange={e => {
//                 const catId = e.target.value;
//                 const cat = categories.find(c => c.id === catId);
//                 setForm({
//                   ...form,
//                   categoryId: catId,
//                   subcategoryId: "",
//                   type: cat?.type || ""
//                 });
//               }}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select Category</option>
//               {categories.map(c => (
//                 <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="subtext block mb-1">Subcategory</label>
//             <select value={form.subcategoryId} onChange={e => setForm({ ...form, subcategoryId: e.target.value })} className="w-full p-2 border rounded" required>
//               <option value="">Select Subcategory</option>
//               {subcategoryOptions.map(s => (
//                 <option key={s.id} value={s.id}>{s.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="subtext block mb-1">Difficulty</label>
//             <input value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full p-2 border rounded" />
//           </div>
//           <div>
//             <label className="subtext block mb-1">Type</label>
//             <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full p-2 border rounded" />
//           </div>
//           <div>
//             <label className="subtext block mb-1">Estimated Time (minutes)</label>
//             <input type="number" value={form.estimatedTime} onChange={e => setForm({ ...form, estimatedTime: e.target.value })} className="w-full p-2 border rounded" />
//           </div>
//           <div>
//             <label className="subtext block mb-1">Link</label>
//             <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full p-2 border rounded" />
//           </div>
//           <div className="md:col-span-3 flex gap-2">
//             <button className="btn btn-primary">{form.id ? "Update" : "Create"}</button>
//             {form.id && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
//           </div>
//         </form>
//       </div>

//       <div className="card">
//         <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
//           <h3 className="font-semibold">Topic List ({topics.length})</h3>
//           <input
//             placeholder="Search by title..."
//             value={filter.q}
//             onChange={e => setFilter({ ...filter, q: e.target.value })}
//             className="p-2 border rounded"
//           />
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2 text-left">Title</th>
//                 <th className="border p-2 text-left">Category</th>
//                 <th className="border p-2 text-left">Subcategory</th>
//                 <th className="border p-2 text-left">Difficulty</th>
//                 <th className="border p-2 text-left">Type</th>
//                 <th className="border p-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topics.length === 0 ? (
//                 <tr><td colSpan="6" className="border p-4 text-center text-gray-500">No topics found.</td></tr>
//               ) : (
//                 topics.map(t => (
//                   <tr key={t.id} className="hover:bg-gray-50">
//                     <td className="border p-2">
//                       <div className="font-medium">{t.title}</div>
//                       {t.link && <a href={t.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Link</a>}
//                     </td>
//                     <td className="border p-2">{t.subcategory?.category?.name || "N/A"}</td>
//                     <td className="border p-2">{t.subcategory?.name || "N/A"}</td>
//                     <td className="border p-2">{t.difficulty || "-"}</td>
//                     <td className="border p-2">{t.type || "-"}</td>
//                     <td className="border p-2">
//                       <div className="flex gap-2">
//                         <button className="btn btn-outline text-xs" onClick={() => onEdit(t)}>Edit</button>
//                         <button className="btn btn-outline text-xs text-red-600" onClick={() => remove(t.id)}>Delete</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


