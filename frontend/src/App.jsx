import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ReportProblemPage from './pages/ReportProblemPage';
import FindRepairersPage from './pages/FindRepairersPage';
import CustomerDashboard from './pages/CustomerDashboard';
import RepairerDashboard from './pages/RepairerDashboard';
import RequestDetailPage from './pages/RequestDetailPage';
import DocumentationPage from './pages/DocumentationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="report" element={<ReportProblemPage />} />
        <Route path="repairers" element={<FindRepairersPage />} />
        <Route path="request/:id" element={<RequestDetailPage />} />
        <Route path="college-docs" element={<DocumentationPage />} />

        {/* Protected Customer Dashboard */}
        <Route
          path="dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Repairer Dashboard */}
        <Route
          path="dashboard/repairer"
          element={
            <ProtectedRoute allowedRoles={['repairer', 'admin']}>
              <RepairerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth Pages */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
