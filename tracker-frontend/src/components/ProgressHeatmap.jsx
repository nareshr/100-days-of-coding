// src/components/ProgressHeatmap.jsx
import React, { useMemo } from "react";

function colorForScore(score) {
  if (!score) return "bg-gray-200";
  if (score < 4) return "bg-yellow-300";
  if (score < 8) return "bg-green-400";
  return "bg-blue-600";
}

export default function ProgressHeatmap({ data = [] }) {
  const tiles = useMemo(() => {
    // ensure 180 tiles
    const arr = Array.from({ length: 180 }, (_, i) => data[i] || { score: 0, date: null });
    return arr;
  }, [data]);

  return (
    <div className="overflow-auto">
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(30, 1fr)" }}>
        {tiles.map((t, i) => (
          <div key={i} title={t.date || `Day ${i + 1}`} className={`w-4 h-4 rounded ${colorForScore(t.score)}`} />
        ))}
      </div>
    </div>
  );
}
