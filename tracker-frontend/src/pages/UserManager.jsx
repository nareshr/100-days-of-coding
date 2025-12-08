import React, { useState } from 'react';

export default function UserManager() {
  const [users] = useState([
    { id: 1, name: 'Naresh', email: 'naresh@example.com', lastActive: '2025-11-21' },
    { id: 2, name: 'Sarju', email: 'sarju@example.com', lastActive: '2025-11-20' },
  ]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Name</th><th>Email</th><th>Last Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.lastActive}</td>
                <td>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
