// src/components/PlanSelectorDrawer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PlanSelectorDrawer({ plans = [], open, onClose, onSelect, currentPlanId }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <motion.aside
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: 300 }}
        className="w-96 bg-white shadow-lg p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Select Plan</div>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>

        <div className="space-y-2">
          {plans.map(p => (
            <div
              key={p.id}
              onClick={() => { onSelect(p); onClose(); }}
              className={`p-3 rounded-lg cursor-pointer border ${p.id === currentPlanId ? 'bg-slate-100 border-slate-200' : 'hover:bg-gray-50'}`}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-slate-500">{p.totalWeeks} weeks • Start {new Date(p.startDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </motion.aside>
    </div>
  );
}
