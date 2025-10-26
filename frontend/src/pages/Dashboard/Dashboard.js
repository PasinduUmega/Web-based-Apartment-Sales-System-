import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from 'react-query';
import { api } from '../../services/api';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Building,
  Package,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isSeller, isAgent, isUser } = useAuth();

  // Fetch dashboard data based on user role
  const { data: dashboardData, isLoading } = useQuery(
    'dashboardData',
    async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  );

  const stats = [
    {
      name: 'Total Users',
      value: dashboardData?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Apartments',
      value: dashboardData?.totalApartments || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Bookings',
      value: dashboardData?.totalBookings || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Revenue',
      value: `$${dashboardData?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+23%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking created for Apartment #123',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'payment',
      message: 'Payment received for Booking #456',
      time: '15 minutes ago',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'feedback',
      message: 'New feedback received for Apartment #789',
      time: '1 hour ago',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'user',
      message: 'New user registered',
      time: '2 hours ago',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      name: 'Add Apartment',
      description: 'Create a new apartment listing',
      icon: Building,
      href: '/apartments',
      roles: ['ADMIN', 'SELLER']
    },
    {
      name: 'View Bookings',
      description: 'Manage apartment bookings',
      icon: Calendar,
      href: '/bookings',
      roles: ['ADMIN', 'USER']
    },
    {
      name: 'Payments',
      description: 'Add and manage payments',
      icon: CreditCard,
      href: '/payments',
      roles: ['ADMIN', 'USER']
    },
    {
      name: 'Installment Plans',
      description: 'Create and manage plans',
      icon: FileText,
      href: '/installment-plans',
      roles: ['ADMIN', 'USER']
    },
    {
      name: 'Feedbacks',
      description: 'Add reviews and manage feedback',
      icon: MessageSquare,
      href: '/feedbacks',
      roles: ['ADMIN', 'USER']
    },
    {
      name: 'Browse Apartments',
      description: 'Find available apartments',
      icon: Building,
      href: '/apartment-listing',
      roles: ['AGENT', 'USER']
    },
    {
      name: 'Manage Inventory',
      description: 'Update inventory status',
      icon: Package,
      href: '/inventory',
      roles: ['ADMIN', 'SELLER']
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    action.roles.includes(user?.role)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-primary-100 text-lg">
          Here's what's happening with your apartment management system today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.name}</p>
                <p className="stat-number">{stat.value}</p>
                <p className={`stat-change ${stat.changeType}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-subtitle">Common tasks and shortcuts</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredQuickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-0"
              >
                <NavLink to={action.href} className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <action.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.name}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-subtitle">Latest system activities</p>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-full">
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Role-specific content */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Admin Panel</h3>
            <p className="card-subtitle">System administration tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavLink
              to="/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <Users className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">User Management</h4>
              <p className="text-sm text-gray-600">Manage system users</p>
            </NavLink>
            <NavLink
              to="/apartments"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <Building className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Apartment Management</h4>
              <p className="text-sm text-gray-600">Manage apartment listings</p>
            </NavLink>
            <NavLink
              to="/inventory"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <Package className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Inventory Management</h4>
              <p className="text-sm text-gray-600">Manage inventory items</p>
            </NavLink>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
