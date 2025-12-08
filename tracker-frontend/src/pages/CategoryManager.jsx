import React, { useState } from 'react';

export default function CategoryManager() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([
    { id: 'dsa', name: 'DSA', items: ['Arrays', 'Graphs'] },
    { id: 'sd', name: 'System Design', items: ['Load Balancer', 'Caching'] }
  ]);

  const addCategory = () => {
    if (!name.trim()) return;
    setCategories(prev => [...prev, { id: Date.now().toString(), name, items: [] }]);
    setName('');
  };

  const removeCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2">Category & Module Manager</h2>
      <div className="mt-4 grid gap-4">
        <div className="flex gap-2">
          <input className="flex-1 p-3 border rounded-lg" placeholder="New category name" value={name} onChange={e=>setName(e.target.value)} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={addCategory}>Add</button>
        </div>

        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="p-3 border rounded-lg flex items-start justify-between">
              <div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.items.join(', ') || 'No modules'}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=>{/* open edit modal */}}>Edit</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>removeCategory(cat.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
