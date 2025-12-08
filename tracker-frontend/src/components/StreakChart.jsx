import React from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from "recharts";

export default function StreakChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
      <div className="font-semibold mb-2">Streak Progress</div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <Tooltip />
          <Line type="monotone" dataKey="streak" stroke="#6366f1" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
