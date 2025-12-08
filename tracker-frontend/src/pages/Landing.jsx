// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT TEXT */}
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            FAANG Prep Tracker
          </h1>
          
          <p className="mt-4 text-gray-600 text-lg">
            A structured, daily, measurable system to help you crack FAANG interviews —
            Coding ● System Design ● Behavioral ● Projects
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 bg-white border rounded-xl shadow hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="mt-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-700">Daily DSA routine</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-700">System design tasks</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-700">Behavioral (STAR) practice</span>
            </div>
          </div>
        </div>

        {/* RIGHT GRAPHIC */}
        <div className="flex justify-center">
          <div className="bg-white shadow-xl rounded-3xl p-6">
            <img
              src="/pwa-512x512.png"
              alt="App Preview"
              className="rounded-2xl w-[350px] h-[350px] object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
