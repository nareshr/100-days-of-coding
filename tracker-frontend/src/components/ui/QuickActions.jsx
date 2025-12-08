import React from "react";

export default function QuickActions({ onOpenWeekly, onOpenSpiritual, onOpenFitness }) {
  return (
    <div className="card">
      <div className="font-semibold mb-3">Quick Actions</div>
      <div className="flex flex-col gap-3">
        <button onClick={onOpenWeekly} className="btn btn-primary w-full">Open Weekly Planner</button>
        <button onClick={onOpenSpiritual} className="btn btn-primary w-full" style={{ background: 'linear-gradient(90deg,#10b981,#059669)' }}>Open Spiritual Plan</button>
        <button onClick={onOpenFitness} className="btn btn-primary w-full" style={{ background: 'linear-gradient(90deg,#ef4444,#f43f5e)' }}>Open Fitness Plan</button>
      </div>
    </div>
  );
}
