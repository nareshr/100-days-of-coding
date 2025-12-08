import React from "react";

export default function WeeklySummary({ weekly = [] }) {
  return (
    <div className="card">
      <div className="section-title">Weekly Summary</div>
      {weekly.length === 0 && <div className="subtext">No weekly data yet.</div>}
      <div className="space-y-3 mt-3">
        {weekly.map(w => (
          <div key={w.week} className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
            <div className="font-medium">Week {w.week}</div>
            <div className="subtext">{w.completed}/{w.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
