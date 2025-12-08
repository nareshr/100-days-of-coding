import React from "react";

export default function PlanCard({ plan, progressPercent = 0, onOpen }) {
  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
        <div>
          <div className="font-semibold">{plan.name}</div>
          <div className="subtext mt-1">{plan.totalWeeks || 0} weeks · starts {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : "-"}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-xs text-slate-500">{progressPercent}%</div>
        <button onClick={() => onOpen(plan)} className="btn btn-primary">Open</button>
      </div>
    </div>
  );
}
