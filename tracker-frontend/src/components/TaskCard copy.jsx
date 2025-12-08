// src/components/TaskCard.jsx
import React from "react";

export default function TaskCard({ title, desc, timeEstimate = "60m", onStart, onMarkDone }) {
  return (
    <article className="bg-white p-4 rounded-2xl shadow transition hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
        <div className="text-xs text-gray-400">{timeEstimate}</div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={onStart} className="px-3 py-1 bg-blue-600 text-white rounded">
          Start
        </button>
        <button onClick={onMarkDone} className="px-3 py-1 border rounded">
          Mark Done
        </button>
      </div>
    </article>
  );
}
