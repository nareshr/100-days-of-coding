// QuickActions.jsx
import React from "react";

export default function QuickActions({ onOpenWeekly, onOpenSpiritual, onOpenFitness }) {
  return (
    <div className="card">
      <div className="font-semibold mb-3">Quick Actions</div>

      <div className="flex flex-col gap-3">
        <button onClick={onOpenWeekly} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow">
          Open Weekly Planner
        </button>

        <button onClick={onOpenSpiritual} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow">
          Open Spiritual Plan
        </button>

        <button onClick={onOpenFitness} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow">
          Open Fitness Plan
        </button>
      </div>
    </div>
  );
}
