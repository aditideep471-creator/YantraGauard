import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Logout from "./auth/Logout";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

import DashboardRedirect from "./dashboard/DashboardRedirect";
import AdminDashboard from "./dashboard/AdminDashboard";
import ManagerDashboard from "./dashboard/ManagerDashboard";
import TechnicianDashboard from "./dashboard/TechnicianDashboard";
import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import MedicalStaffDashboard from "./dashboard/MedicalStaffDashboard";

import DepartmentDashboard from "./dashboard/DepartmentDashboard";
import FireDepartment from "./departments/FireDepartment";
import MechanicalDepartment from "./departments/MechanicalDepartment";
import ElectricalDepartment from "./departments/ElectricalDepartment";
import MedicalDepartment from "./departments/MedicalDepartment";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Navbar from "./components/Navbar";

import IncidentList from "./incidents/IncidentList";
import UploadIncident from "./incidents/UploadIncident";
import IncidentDetails from "./incidents/IncidentDetails";
import MedicalIncidents from "./incidents/MedicalIncidents";

import AdminUsers from "./admin/AdminUsers";
import SystemStatus from "./dashboard/SystemStatus";
import TechnicianIncidents from "./incidents/TechnicianIncidents";

import ManagerIncidents from "./manager/ManagerIncidents";
import UnassignedIncidents from "./manager/UnassignedIncidents";

import EmployeeIncidents from "./incidents/EmployeeIncidents";

function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* ================= DASHBOARD REDIRECT ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* ================= INCIDENT ROUTES ================= */}
        <Route
          path="/incidents/:id"
          element={
            <ProtectedRoute>
              <IncidentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents/upload"
          element={
            <ProtectedRoute>
              <UploadIncident />
            </ProtectedRoute>
          }
        />
        {/* ================= Medical INCIDENTS ================= */}

        <Route
          path="/incidents/medical"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["medical_staff"]}>
                <MedicalIncidents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE INCIDENTS ================= */}
        <Route
          path="/employee/incidents"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["employee"]}>
                <EmployeeIncidents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminUsers />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= ROLE DASHBOARDS ================= */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["manager"]}>
                <ManagerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/technician"
          element={
            <ProtectedRoute>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard/medical"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["medical_staff"]}>
                <MedicalStaffDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= MANAGER INCIDENT ROUTES ================= */}
        <Route
          path="/manager/incidents"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["manager"]}>
                <ManagerIncidents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/unassigned"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["manager"]}>
                <UnassignedIncidents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= DEPARTMENT DASHBOARD ================= */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DepartmentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SYSTEM STATUS ================= */}
        <Route
          path="/system-status"
          element={
            <ProtectedRoute>
              <SystemStatus />
            </ProtectedRoute>
          }
        />

        {/* ================= TECHNICIAN INCIDENT MANAGEMENT ================= */}
        <Route
          path="/incidents/manage"
          element={
            <ProtectedRoute>
              <TechnicianIncidents />
            </ProtectedRoute>
          }
        />

        {/* ================= DEPARTMENT PAGES ================= */}
        <Route
          path="/department/fire"
          element={
            <ProtectedRoute>
              <FireDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/mechanical"
          element={
            <ProtectedRoute>
              <MechanicalDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/electrical"
          element={
            <ProtectedRoute>
              <ElectricalDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/medical"
          element={
            <ProtectedRoute>
              <MedicalDepartment />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;