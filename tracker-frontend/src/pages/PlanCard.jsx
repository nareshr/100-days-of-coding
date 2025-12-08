import React from "react";
import { motion } from "framer-motion";
import ProgressRing from "../components/ProgressRing";

// export default function PlanCard({ plan, progressPercent = 0, totalTasks = 0, completed = 0, onOpen }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 6 }}
//       className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
//     >
//       <div className="p-4 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <div className="w-20 h-20 flex items-center justify-center">
//             <ProgressRing percent={Math.round(progressPercent)} />
//           </div>

//           <div>
//             <div className="text-lg font-semibold">{plan.name}</div>
//             <div className="text-sm text-slate-500 mt-1">
//               {completed} / {totalTasks} tasks &middot; {plan.totalWeeks} weeks
//             </div>
//             <div className="mt-2 text-xs text-slate-400">{plan.startDate ? `Starts ${new Date(plan.startDate).toLocaleDateString()}` : ''}</div>
//           </div>
//         </div>

//         <div className="flex flex-col items-end gap-2">
//           <button
//             onClick={() => onOpen(plan)}
//             className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm shadow-sm hover:opacity-95"
//           >
//             Open plan
//           </button>
//           <a
//             href={`/weekly`}
//             className="text-xs underline text-slate-600"
//             onClick={(e) => { e.preventDefault(); onOpen(plan); }}
//           >
//             Go to weekly view
//           </a>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


export default function PlanCard({ plan, progress, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center justify-between soft-shadow"
    >
      <div className="flex items-center gap-5">
        <div className="icon-box">
          <span className="text-brand-600 text-xl">📘</span>
        </div>

        <div>
          <div className="text-xl font-semibold">{plan.name}</div>
          <div className="subtext mt-1">{plan.totalWeeks} weeks · starts {new Date(plan.startDate).toLocaleDateString()}</div>
          <div className="mt-1 text-slate-900 font-medium">{progress}%</div>
        </div>
      </div>

      <button
        onClick={() => onOpen(plan)}
        className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-md"
      >
        Open
      </button>
    </motion.div>
  );
}
