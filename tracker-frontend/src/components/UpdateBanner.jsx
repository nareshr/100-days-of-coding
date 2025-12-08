// src/components/UpdateBanner.jsx
import React from "react";

export default function UpdateBanner({ onReload }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 right-6 bg-yellow-300 p-4 rounded-xl shadow">
      <div className="font-semibold mb-2">New version available</div>
      <div className="flex gap-2">
        <button onClick={onReload} className="px-3 py-1 bg-blue-600 text-white rounded">Reload</button>
      </div>
    </div>
  );
}
