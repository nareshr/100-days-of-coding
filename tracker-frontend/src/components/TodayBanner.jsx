// src/components/TodayBanner.jsx
import React from "react";
import { motion } from "framer-motion";

export default function TodayBanner({ dayStats = { total: 0, completed: 0 } }) {
  const { total, completed } = dayStats;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-sky-50 to-white p-3 rounded-lg border border-sky-100 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-700">Today's Highlights</div>
          <div className="text-lg font-semibold">{completed} of {total} tasks done • {pct}%</div>
        </div>
        <div className="text-sm text-slate-500">Keep your streak going — small wins add up.</div>
      </div>
    </motion.div>
  );
}
