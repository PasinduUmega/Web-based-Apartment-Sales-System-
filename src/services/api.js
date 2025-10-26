import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Users (used for simple register/login in absence of auth service)
  users: '/users',
  userById: (id) => `/users/${id}`,
  
  // Apartments
  apartments: '/apartments',
  apartmentById: (id) => `/apartments/${id}`,
  
  // Inventory
  inventory: '/inventories',
  inventoryById: (id) => `/inventories/${id}`,
  
  // Bookings
  bookings: '/bookings',
  bookingById: (id) => `/bookings/${id}`,
  userBookings: '/bookings/user',
  
  // Feedbacks
  feedbacks: '/feedbacks',
  feedbackById: (id) => `/feedbacks/${id}`,
  apartmentFeedbacks: (id) => `/feedbacks/apartment/${id}`,
  
  // Payments
  payments: '/payments',
  paymentById: (id) => `/payments/${id}`,
  userPayments: '/payments/user',
  
  // Installment Plans
  installmentPlans: '/installment-plans',
  installmentPlanById: (id) => `/installment-plans/${id}`,
  userInstallmentPlans: '/installment-plans/user',
};

export default api;
