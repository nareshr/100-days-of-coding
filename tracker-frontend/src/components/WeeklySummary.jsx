import React from "react";

export default function WeeklySummary({ weekly }) {
  return (
    <div className="card">
      <div className="font-semibold mb-3">Weekly Summary</div>

      <div className="space-y-3">
        {weekly.map(w => (
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
            <div className="font-medium">Week {w.week}</div>
            <div className="text-slate-700">{w.completed} / {w.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// export default function WeeklySummary({ weekly }) {
//   return (
//     <div className="card">
//       <div className="font-semibold mb-4">Weekly Summary</div>

//       {weekly.length === 0 && (
//         <div className="subtext">No weekly data yet.</div>
//       )}

//       <div className="space-y-3">
//         {weekly.map((w, idx) => (
//           <div key={idx} className="flex justify-between">
//             <div className="font-medium">Week {w.week}</div>
//             <div className="text-slate-600">
//               {w.completed}/{w.total} tasks
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
