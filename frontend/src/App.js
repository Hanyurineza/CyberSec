import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

// Dashboards
import SuperAdminDashboardPage from "./pages/SuperAdminDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Pages
import ManageStaffPage from "./pages/ManageStaffPage";
import TopicsPage from "./pages/TopicsPage";
import AddQuizPage from "./pages/AddQuizPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import TrainingPage from "./pages/TrainingPage";
import AssignTrainingPage from "./pages/AssignTrainingPage";

import ManageTipsPage from "./pages/ManageTipsPage";
import ViewTipsPage from "./pages/ViewTipsPage";

import StaffTopicsPage from "./pages/StaffTopicsPage";
import SendTipsPage from "./pages/SendTipsPage";
import TakeQuizPage from "./pages/TakeQuizPage";
import PrivateRoute from "./components/PrivateRoute";
import TopicDetailPage from "./pages/TopicDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTE ---------- */}
        <Route path="/" element={<LoginPage />} />

        {/* ---------- SUPERADMIN ROUTES ---------- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin"]}>
              <SuperAdminDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin"]}>
              <ManageStaffPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/topics"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin"]}>
              <TopicsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-quiz"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin"]}>
              <AddQuizPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin"]}>
              <ReportsPage />
            </PrivateRoute>
          }
        />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-tips"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin", "Admin"]}>
              <ManageTipsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/assign-training"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin", "Admin"]}>
              <AssignTrainingPage />
            </PrivateRoute>
          }
        />

        {/* ---------- STAFF ROUTES ---------- */}
        <Route
          path="/staff-dashboard"
          element={
            <PrivateRoute allowedRoles={["Staff"]}>
              <StaffDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/staff-awareness-topics"
          element={
            <PrivateRoute allowedRoles={["Staff"]}>
              <StaffTopicsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/send-tips"
          element={
            <PrivateRoute allowedRoles={["Staff"]}>
              <SendTipsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <PrivateRoute allowedRoles={["Staff"]}>
              <TakeQuizPage />
            </PrivateRoute>
          }
        />

        {/* ---------- SHARED ROUTES ---------- */}
        <Route
          path="/tips"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin", "Admin", "Staff"]}>
              <ViewTipsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin", "Admin", "Staff"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/training"
          element={
            <PrivateRoute allowedRoles={["SuperAdmin", "Admin", "Staff"]}>
              <TrainingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/topic-view"
          element={
            <PrivateRoute allowedRoles={["Staff", "Admin", "SuperAdmin"]}>
              <TopicDetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
