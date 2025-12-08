import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaList, FaLeaf, FaDumbbell } from "react-icons/fa";

export default function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="bottom-nav md:hidden">
      <Link to="/dashboard" className={loc.pathname === "/dashboard" ? "active" : ""}><FaHome /></Link>
      <Link to="/weekly" className={loc.pathname === "/weekly" ? "active" : ""}><FaCalendarAlt /></Link>
      <Link to="/spiritual-plan" className={loc.pathname === "/spiritual-plan" ? "active" : ""}><FaLeaf /></Link>
      <Link to="/fitness-plan" className={loc.pathname === "/fitness-plan" ? "active" : ""}><FaDumbbell /></Link>
      <Link to="/day" className={loc.pathname === "/day" ? "active" : ""}><FaList /></Link>
    </nav>
  );
}
