import React from "react";

export default function TodayBanner({ dayStats = { total: 0, completed: 0 } }) {
  const { total, completed } = dayStats;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="today-banner card-sm">
      <div className="flex justify-between items-center">
        <div>
          <div className="subtext">Today's Highlights</div>
          <div className="text-lg font-semibold">{completed} of {total} tasks done • {pct}%</div>
        </div>
        <div className="subtext">Keep your streak going — small wins add up.</div>
      </div>
    </div>
  );
}
