import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (_) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Note: backend has no auth endpoints; we mimic minimal auth client-side

  const login = async ({ email }) => {
    try {
      // naive login: find first user by email
      const res = await api.get(endpoints.users);
      const list = res.data || [];
      const found = list.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
      if (!found) throw new Error('No user with that email');
      setUser(found);
      localStorage.setItem('user', JSON.stringify(found));
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      // default role USER if not provided
      const payload = { role: 'USER', ...userData };
      const response = await api.post(endpoints.users, payload);
      const created = response.data;
      setUser(created);
      localStorage.setItem('user', JSON.stringify(created));
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isSeller: user?.role === 'SELLER',
    isAgent: user?.role === 'AGENT',
    isUser: user?.role === 'USER'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
