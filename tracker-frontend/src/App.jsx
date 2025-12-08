import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import SpiritualPlan from "./pages/SpiritualPlan";
import FitnessPlan from "./pages/FitnessPlan";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">FAANG Tracker</Link>
          <nav className="space-x-3">
            <Link to="/weekly" className="text-sm">Weekly</Link>
            <Link to="/spiritual" className="text-sm">Spiritual</Link>
            <Link to="/fitness" className="text-sm">Fitness</Link>
            <Link to="/reports" className="text-sm">Reports</Link>
            <Link to="/login" className="text-sm">Login</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/weekly" element={<WeeklyPlanner/>} />
          <Route path="/spiritual" element={<SpiritualPlan/>} />
          <Route path="/fitness" element={<FitnessPlan/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </main>
    </div>
  );
}
