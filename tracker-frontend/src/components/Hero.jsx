// Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">FAANG Prep Tracker — plan, practise and shine</h1>
          <p className="subtext mt-4 max-w-xl">Daily routines, measurable progress and offline-ready practice for FAANG interviews — coding, system design and behavioral.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/register" className="px-5 py-3 bg-brand-600 text-white rounded-lg shadow">Get started</Link>
            <Link to="/login" className="px-5 py-3 border rounded-lg subtext">Sign in</Link>
          </div>
        </div>

        <div className="flex justify-center">
          {/* Simple illustrative SVG */}
          <figure className="w-full max-w-md">
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <rect rx="28" width="100%" height="100%" fill="url(#g1)"/>
              <g transform="translate(40,40)" fill="#fff" opacity="0.95">
                <rect x="0" y="0" width="440" height="280" rx="18" />
                <circle cx="80" cy="90" r="28" />
                <rect x="140" y="70" width="240" height="24" rx="8" />
                <rect x="140" y="110" width="180" height="18" rx="8" />
              </g>
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}
