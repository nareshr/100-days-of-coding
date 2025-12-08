// src/layouts/LandingLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header simple />  {/* Simple header (logo + login/register) */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
