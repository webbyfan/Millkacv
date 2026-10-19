import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import CreateResumePage from "./pages/CreateResumePage";
import MyResumesPage from "./pages/MyResumesPage";
import ATSTipsPage from "./pages/ATSTipsPage";
import ProfilePage from "./pages/ProfilePage";
import ViewResumePage from "./pages/ViewResumePage";
import EditResumePage from "./pages/EditResumePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<CreateAccountPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-resume"
        element={
          <ProtectedRoute>
            <CreateResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-resume/:id"
        element={
          <ProtectedRoute>
            <ViewResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-resume/:id"
        element={
          <ProtectedRoute>
            <EditResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-resumes"
        element={
          <ProtectedRoute>
            <MyResumesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats-tips"
        element={
          <ProtectedRoute>
            <ATSTipsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
