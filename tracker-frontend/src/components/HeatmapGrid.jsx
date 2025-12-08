import React from "react";
import { motion } from "framer-motion";

function colorForRatio(ratio) {
  if (!ratio) return "bg-slate-200";
  if (ratio < 0.4) return "bg-green-200";
  if (ratio < 0.7) return "bg-green-400";
  return "bg-green-600";
}

export default function HeatmapGrid({ buckets }) {
  const today = new Date();

  const days = [];
  for (let i = 89; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const d = dt.toISOString().slice(0, 10);
    const b = buckets.find(x => x.date === d);

    const ratio = b ? b.completed / b.total : 0;

    days.push(ratio);
  }

  return (
    <div className="card">
      <div className="font-semibold mb-4">Recent Activity</div>

      <div className="grid grid-cols-15 gap-2">
        {days.map((ratio, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-md ${
              ratio === 0 ? "bg-slate-300" :
              ratio < 0.4 ? "bg-green-200" :
              ratio < 0.7 ? "bg-green-400" :
              "bg-green-600"
            }`}
          />
        ))}
      </div>

      <div className="subtext mt-3">Dark green = more completed.</div>
    </div>
  );
}


// export default function HeatmapGrid({ buckets }) {
//   const today = new Date();
//   const squares = [];

//   for (let i = 89; i >= 0; i--) {
//     const dt = new Date(today);
//     dt.setDate(today.getDate() - i);
//     const dateStr = dt.toISOString().slice(0, 10);

//     const bucket = buckets.find(b => b.date === dateStr);
//     const ratio = bucket ? bucket.completed / bucket.total : 0;

//     squares.push({ date: dateStr, ratio });
//   }

//   return (
//     <div className="card">
//       <div className="font-semibold mb-4">Recent Activity</div>

//       <div className="grid-15">
//         {squares.map((s, idx) => (
//           <motion.div
//             key={idx}
//             title={`${s.date} - ${(s.ratio * 100).toFixed(0)}%`}
//             className={`w-5 h-5 rounded-md ${colorForRatio(s.ratio)}`}
//             whileHover={{ scale: 1.15 }}
//           />
//         ))}
//       </div>

//       <div className="mt-3 text-xs text-slate-500">
//         Darker green = better completion.
//       </div>
//     </div>
//   );
// }
