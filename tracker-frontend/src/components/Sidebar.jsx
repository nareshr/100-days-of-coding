import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : ''}`}
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <nav className="p-4 sticky top-6">
      <ul className="space-y-2">
        <li><NavItem to="/dashboard">🏠 Dashboard</NavItem></li>
        <li><NavItem to="/categories">🗂 Categories</NavItem></li>
        <li><NavItem to="/users">👥 Users</NavItem></li>
        <li><NavItem to="/settings">⚙️ Settings</NavItem></li>
      </ul>
    </nav>
  );
}
