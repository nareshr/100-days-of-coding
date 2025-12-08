import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function WeeklyHeatmap({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
      <div className="font-semibold mb-2">Weekly Completion Trend</div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="week" />
          <Tooltip />
          <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
