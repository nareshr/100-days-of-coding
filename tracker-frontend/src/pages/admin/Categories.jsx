import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Categories() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  async function load(){ const r = await api.get('/admin/categories'); setList(r.data || []); }
  useEffect(()=>{ load(); }, []);
  async function create(){ await api.post('/admin/categories', { name }); setName(''); await load(); }
  async function del(id){ await api.delete(`/admin/categories/${id}`); await load(); }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded" placeholder="New category name" />
          <div className="mt-3"><button className="btn btn-primary" onClick={create}>Create</button></div>
        </div>
        <div className="md:col-span-2 card">
          <div className="space-y-2">
            {list.map(c => <div key={c.id} className="flex justify-between p-2 bg-slate-50 rounded"><div>{c.name}</div><button className="btn btn-outline" onClick={()=>del(c.id)}>Delete</button></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
