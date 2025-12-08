import React from "react";

export default function DailyProgressWidget({ dayStats = { total: 0, completed: 0 }, todayTasks = [], onToggle }) {
  const percent = dayStats.total ? Math.round((dayStats.completed / dayStats.total) * 100) : 0;
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Today's Progress</div>
          <div className="subtext">{percent}%</div>
        </div>
        <div className="text-2xl font-bold">{percent}%</div>
      </div>

      <div className="mt-4 space-y-3">
        {todayTasks.map(t => (
          <div key={t.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div className="text-sm">{t.topic?.title || t.title}</div>
            <button onClick={() => onToggle(t)} className={`px-3 py-1 rounded-md text-sm ${t.completed ? 'bg-success-500 text-white' : 'bg-white border'}`}>{t.completed ? 'Done' : 'Mark'}</button>
          </div>
        ))}
        {todayTasks.length === 0 && <div className="subtext">No tasks scheduled for today.</div>}
      </div>
    </div>
  );
}
