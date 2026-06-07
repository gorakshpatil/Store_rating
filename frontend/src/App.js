import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import StoreList from './pages/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/update-password" element={
        <ProtectedRoute roles={['admin', 'user', 'store_owner']}>
          <UpdatePassword />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute roles={['admin']}>
          <AdminStores />
        </ProtectedRoute>
      } />

      <Route path="/stores" element={
        <ProtectedRoute roles={['user']}>
          <StoreList />
        </ProtectedRoute>
      } />

      <Route path="/owner/dashboard" element={
        <ProtectedRoute roles={['store_owner']}>
          <OwnerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/unauthorized" element={
        <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ color: 'var(--accent2)', marginBottom: 12 }}>Access Denied</h2>
          <p style={{ color: 'var(--text-muted)' }}>You don't have permission to view this page.</p>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
