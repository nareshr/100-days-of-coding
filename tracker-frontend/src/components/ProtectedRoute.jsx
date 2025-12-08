import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Could render a spinner; returning null avoids flicker
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Role mismatch: send user back to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
