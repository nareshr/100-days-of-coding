import React from "react";
import { motion } from "framer-motion";

export default function AnimatedCheckbox({ checked, onChange }) {
  return (
    <motion.div
      onClick={() => onChange(!checked)}
      className={`w-6 h-6 rounded-md border-2 cursor-pointer flex items-center justify-center 
      ${checked ? 'bg-green-500 border-green-600' : 'border-gray-400'}`}
      whileTap={{ scale: 0.8 }}
    >
      {checked && (
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5 13l4 4L19 7" />
        </motion.svg>
      )}
    </motion.div>
  );
}
