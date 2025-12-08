// src/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex gap-6">
        
        {/* Sidebar (hidden on mobile, visible on desktop) */}
        <aside className="hidden lg:block lg:w-64">
          <Sidebar />
        </aside>

        {/* Main App Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
