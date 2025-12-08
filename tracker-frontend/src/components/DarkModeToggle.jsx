import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} className="px-3 py-2 rounded-full bg-white/60 dark:bg-slate-700/60 shadow-sm">
      {mode === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-700" />}
    </button>
  );
}
