import React from "react";

export default function WeekSelector({ week, setWeek }) {
  return (
    <div className="flex items-center mb-4">
      <button
        onClick={() => setWeek((w) => Math.max(1, w - 1))}
        className="px-3 py-1 bg-gray-200 rounded-lg"
      >
        Prev
      </button>

      <div className="mx-4 font-semibold text-lg">Week {week}</div>

      <button
        onClick={() => setWeek((w) => w + 1)}
        className="px-3 py-1 bg-gray-200 rounded-lg"
      >
        Next
      </button>
    </div>
  );
}
