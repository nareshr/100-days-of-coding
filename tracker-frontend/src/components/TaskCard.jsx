import React from "react";
import AnimatedCheckbox from "./AnimatedCheckbox";

export default function TaskCard({ task, onToggle }) {
  if (!task) {
    return null;
  }

  const topicTitle = task.topic?.title || "Untitled Task";
  const subcategoryName = task.topic?.subcategory?.name;

  return (
    <div className="bg-white shadow-sm rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200 hover:shadow-md transition">
      <div>
        <div className="font-medium">{topicTitle}</div>
        {subcategoryName && (
          <div className="text-xs text-gray-500">{subcategoryName}</div>
        )}
      </div>

      <AnimatedCheckbox checked={task.completed || false} onChange={() => onToggle(task)} />
    </div>
  );
}
