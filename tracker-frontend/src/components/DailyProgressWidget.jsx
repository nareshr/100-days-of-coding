// src/components/DailyProgressWidget.jsx
import React from "react";
import ProgressRing from "./ProgressRing";
import { motion } from "framer-motion";

export default function DailyProgressWidget({ stats, tasks, onToggle }) {
  const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="card soft-shadow">
      <div className="text-lg font-semibold mb-3">Today's Progress</div>

      <div className="flex items-center justify-between">
        <ProgressRing percent={percent} />
        <div className="text-xl font-bold">{percent}%</div>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.map(t => (
          <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
            <div className="text-sm">{t.topic.title}</div>
            <button
              onClick={() => onToggle(t)}
              className={`px-3 py-1 rounded-md text-sm ${t.completed ? "bg-success-500 text-white" : "bg-white border"}`}
            >
              {t.completed ? "Done" : "Mark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// export default function DailyProgressWidget({ dayStats = { total: 0, completed: 0 }, todayTasks = [], onToggle }) {
//   const percent = dayStats.total ? Math.round((dayStats.completed / dayStats.total) * 100) : 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl p-4 shadow border border-gray-100"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="text-sm text-slate-500">Today's Progress</div>
//           <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="w-16 h-16">
//             <ProgressRing percent={percent} />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3 space-y-2">
//         {todayTasks.length === 0 && <div className="text-sm text-slate-500">No tasks scheduled for today.</div>}
//         {todayTasks.slice(0, 5).map((t) => (
//           <div key={t.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//             <div className="text-sm">{t.topic.title}</div>
//             <div>
//               <button
//                 onClick={() => onToggle(t)}
//                 className={`px-2 py-1 rounded text-xs ${t.completed ? 'bg-green-600 text-white' : 'bg-white border'}`}
//               >
//                 {t.completed ? 'Done' : 'Mark'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }
