import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import SiteHeader from "./components/SiteHeader";
import BottomNav from "./components/BottomNav";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import WeeklyPlannerPolished from "./pages/WeeklyPlannerPolished";
import DayViewPolished from "./pages/DayViewPolished";
import SpiritualPage from "./pages/SpiritualPlan";
import FitnessPage from "./pages/FitnessPlan";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminPanel from "./pages/admin/AdminPanel";
import Users from "./pages/admin/Users";
import Plans from "./pages/admin/Plans";
import PlanDetail from "./pages/admin/PlanDetail";
import Categories from "./pages/admin/Categories";
import Topics from "./pages/admin/Topics";
import Reports from "./pages/admin/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrap><LandingPage /></PageWrap>} />

          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <PageWrap><Login /></PageWrap>
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : <PageWrap><Register /></PageWrap>
            }
          />
          <Route
            path="/forgot"
            element={
              user ? <Navigate to="/dashboard" replace /> : <PageWrap><ForgotPassword /></PageWrap>
            }
          />

          {/* Protected user routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageWrap><Dashboard /></PageWrap>
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly"
            element={
              <ProtectedRoute>
                <PageWrap><WeeklyPlannerPolished /></PageWrap>
              </ProtectedRoute>
            }
          />
          <Route
            path="/day"
            element={
              <ProtectedRoute>
                <PageWrap><DayViewPolished /></PageWrap>
              </ProtectedRoute>
            }
          />
          <Route
            path="/spiritual-plan"
            element={
              <ProtectedRoute>
                <PageWrap><SpiritualPage /></PageWrap>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fitness-plan"
            element={
              <ProtectedRoute>
                <PageWrap><FitnessPage /></PageWrap>
              </ProtectedRoute>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <PageWrap><AdminPanel /></PageWrap>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<Users />} />
            <Route path="plans" element={<Plans />} />
            <Route path="plans/:id" element={<PlanDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="topics" element={<Topics />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </>
  );
}

function PageWrap({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.main>
  );
}

export default AppRoutes;
