// src/components/TaskRow.jsx
import React from "react";

export default function TaskRow({ label, link, done = false, onToggle, subLabel }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div>
        {link ? (
          <a className="font-medium text-blue-600 hover:underline" href={link} target="_blank" rel="noreferrer">
            {label}
          </a>
        ) : (
          <div className="font-medium">{label}</div>
        )}
        {subLabel && <div className="text-xs text-gray-500">{subLabel}</div>}
      </div>

      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={!!done}
            onChange={onToggle}
            aria-label={`Toggle ${label}`}
          />
        </label>
      </div>
    </div>
  );
}
