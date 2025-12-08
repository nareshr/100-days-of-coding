// src/components/PomodoroTimer.jsx
import React, { useEffect, useState } from "react";

export default function PomodoroTimer({ initialMinutes = 25 }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t;
    if (running) {
      t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => clearInterval(t);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="text-center">
      <div className="text-3xl font-mono">{String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}</div>
      <div className="mt-3 flex gap-2 justify-center">
        <button onClick={() => setRunning(true)} className="px-3 py-1 bg-green-600 text-white rounded">Start</button>
        <button onClick={() => setRunning(false)} className="px-3 py-1 bg-gray-200 rounded">Pause</button>
        <button onClick={() => { setRunning(false); setSeconds(initialMinutes * 60); }} className="px-3 py-1 bg-gray-100 rounded">Reset</button>
      </div>
    </div>
  );
}
