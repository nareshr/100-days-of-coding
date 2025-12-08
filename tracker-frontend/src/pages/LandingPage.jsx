// LandingPage.jsx
import React from "react";
import Hero from "../components/Hero";
// import SiteHeader from "../components/SiteHeader";

export default function LandingPage(){
  return (
    <>
      {/* <SiteHeader /> */}
      <main className="app-container">
        <Hero />
        <section className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold">Daily DSA</h3>
            <p className="subtext mt-2">Two curated LeetCode problems a day tailored for your level.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">System Design</h3>
            <p className="subtext mt-2">Deep dives and architecture blueprints for FAANG interviews.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Behavioral & STAR</h3>
            <p className="subtext mt-2">Practice STAR answers and measure your fluency.</p>
          </div>
        </section>
      </main>
    </>
  );
}
