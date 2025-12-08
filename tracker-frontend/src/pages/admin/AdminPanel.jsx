import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FiUsers, FiFolder, FiList, FiBarChart2, FiTarget } from "react-icons/fi";

export default function AdminPanel(){
  const location = useLocation();
  const links = [
    { to: "/admin/users", label: "Users", icon: <FiUsers /> },
    { to: "/admin/categories", label: "Categories", icon: <FiFolder /> },
    { to: "/admin/topics", label: "Topics", icon: <FiTarget /> },
    { to: "/admin/plans", label: "Plans", icon: <FiList /> },
    { to: "/admin/reports", label: "Reports", icon: <FiBarChart2 /> },
  ];
  return (
    <div className="app-container space-y-4">
      <div className="page-hero flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500 uppercase tracking-wide">Admin Console</div>
          <div className="text-xl font-semibold text-slate-800 dark:text-slate-100">Control center</div>
        </div>
        <div className="badge-admin">Admin</div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <aside className="card-sm admin-side space-y-2">
          <div className="font-semibold mb-1">Navigation</div>
          <ul className="space-y-1">
            {links.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={location.pathname.startsWith(l.to) ? "active" : ""}
                >
                  {l.icon}
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
