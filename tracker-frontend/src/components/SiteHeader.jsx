// updated SiteHeader.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { logout } from "../services/auth";
import useAuth from "../hooks/useAuth";

export default function SiteHeader() {
  const navigate = useNavigate();
  const { user, loading, refresh } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const doLogout = async () => {
    try {
      await logout();
      await refresh(); // refresh auth state
      navigate("/login");
    } catch (e) {
      console.error(e);
      await refresh();
      navigate("/login");
    }
  };

  const links = [
    { to: "/weekly", label: "Weekly" },
    { to: "/spiritual-plan", label: "Spiritual" },
    { to: "/fitness-plan", label: "Fitness" },
    { to: "/dashboard", label: "Dashboard" },
  ];
  if (user?.role === "admin") {
    links.push({ to: "/admin/users", label: "Admin" });
  }

  return (
    <header className="py-4 bg-transparent">
      <div className="app-container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold shadow">FT</div>
            <div>
              <div className="text-lg font-bold">FAANG Tracker</div>
              <div className="subtext">Prepare. Track. Win.</div>
            </div>
          </Link>
          {loading ? null : user ? (
            <nav className="hidden md:flex items-center gap-4 ml-8">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="subtext hover:text-brand-600">
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button className="md:hidden btn btn-outline px-3 py-2" onClick={() => setMobileOpen(!mobileOpen)}>
            Menu
          </button>
          <DarkModeToggle />
          {loading ? null : user ? (
            <>
              <div className="hidden md:block subtext">Hi, {user.name || user.email}</div>
              <button onClick={doLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register" className="hidden md:inline btn btn-outline">Register</Link>
              <Link to="/login" className="hidden md:inline btn btn-outline">Login</Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && !loading && user && (
        <div className="md:hidden mt-3 bg-white/80 dark:bg-slate-900/90 backdrop-blur border-t border-b">
          <div className="app-container py-3 space-y-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="block subtext font-medium" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <button onClick={() => { setMobileOpen(false); doLogout(); }} className="btn btn-outline w-full mt-2">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
