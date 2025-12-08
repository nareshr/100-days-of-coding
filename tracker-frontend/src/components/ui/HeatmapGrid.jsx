import React from "react";
import { motion } from "framer-motion";

function colorForRatio(r) {
  if (!r) return "bg-slate-200";
  if (r < 0.4) return "bg-green-200";
  if (r < 0.7) return "bg-green-400";
  return "bg-green-600";
}

export default function HeatmapGrid({ dayBuckets = [], days = 90 }) {
  const today = new Date();
  const arr = [];
  const map = new Map(dayBuckets.map(d => [d.date, d]));
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const dateStr = dt.toISOString().slice(0, 10);
    const b = map.get(dateStr);
    const ratio = b ? (b.total ? b.completed / b.total : 0) : 0;
    arr.push({ date: dateStr, ratio });
  }

  return (
    <div className="card">
      <div className="section-title">Recent Activity</div>
      <div className="grid-15">
        {arr.map((s, i) => (
          <motion.div key={i} title={`${s.date} ${(s.ratio*100).toFixed(0)}%`} className={`heat-cell ${colorForRatio(s.ratio)}`} whileHover={{ scale: 1.08 }} />
        ))}
      </div>
      <div className="subtext mt-3">Darker = more tasks completed</div>
    </div>
  );
}
