import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import ApartmentManagement from './pages/ApartmentManagement/ApartmentManagement';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement';
import BookingManagement from './pages/BookingManagement/BookingManagement';
import FeedbackManagement from './pages/FeedbackManagement/FeedbackManagement';
import PaymentManagement from './pages/PaymentManagement/PaymentManagement';
import InstallmentPlanManagement from './pages/InstallmentPlanManagement/InstallmentPlanManagement';
import ApartmentListing from './pages/ApartmentListing/ApartmentListing';
import ApartmentDetails from './pages/ApartmentListing/ApartmentDetails';
import UserProfile from './pages/UserProfile/UserProfile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="apartments" element={<ApartmentManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="feedbacks" element={<FeedbackManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="installment-plans" element={<InstallmentPlanManagement />} />
        <Route path="apartment-listing" element={<ApartmentListing />} />
        <Route path="apartment-listing/:id" element={<ApartmentDetails />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
        >
          <AppRoutes />
        </motion.div>
      </Router>
    </AuthProvider>
  );
}

export default App;
