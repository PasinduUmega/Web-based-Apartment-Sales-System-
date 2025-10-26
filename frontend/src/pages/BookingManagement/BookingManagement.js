import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { api, endpoints } from '../../services/api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Clock,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const BookingManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery(
    'bookings',
    async () => {
      const response = await api.get(endpoints.bookings);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }
  );

  // Fetch users and apartments for dropdowns
  const { data: users } = useQuery('users', async () => {
    const response = await api.get(endpoints.users);
    return response.data;
  });

  const { data: apartments } = useQuery('apartments', async () => {
    const response = await api.get(endpoints.apartments);
    return response.data;
  });

  // Create booking mutation
  const createBookingMutation = useMutation(
    async (bookingData) => {
      const response = await api.post(endpoints.bookings, bookingData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings');
        toast.success('Booking created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    }
  );

  // Update booking mutation
  const updateBookingMutation = useMutation(
    async ({ id, bookingData }) => {
      const response = await api.put(endpoints.bookingById(id), bookingData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings');
        toast.success('Booking updated successfully!');
        setIsModalOpen(false);
        setEditingBooking(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update booking');
      }
    }
  );

  // Delete booking mutation
  const deleteBookingMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.bookingById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings');
        toast.success('Booking deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  );

  const onSubmit = (data) => {
    const payload = {
      user: data.userId ? { id: Number(data.userId) } : null,
      apartment: data.apartmentId ? { id: Number(data.apartmentId) } : null,
      bookingDate: data.bookingDate ? new Date(data.bookingDate).toISOString() : null,
      status: data.status
    };
    if (editingBooking) {
      updateBookingMutation.mutate({ id: editingBooking.id, bookingData: payload });
    } else {
      createBookingMutation.mutate(payload);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    reset(booking);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBookingMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBooking(null);
    reset();
  };

  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner text="Loading bookings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="mt-2 text-gray-600">Manage apartment bookings and reservations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Booking</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">User</th>
                <th className="table-header-cell">Apartment</th>
                <th className="table-header-cell">Booking Date</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <AnimatePresence>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.user?.username}</p>
                          <p className="text-sm text-gray-500">{booking.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.apartment?.location}</p>
                          <p className="text-sm text-gray-500">${booking.apartment?.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${
                        booking.status === 'CONFIRMED' ? 'status-active' :
                        booking.status === 'PENDING' ? 'status-pending' :
                        booking.status === 'CANCELLED' ? 'status-inactive' :
                        'status-completed'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBooking ? 'Edit Booking' : 'Add New Booking'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">User</label>
            <select
              {...register('userId', { required: 'User is required' })}
              className={`form-select ${errors.userId ? 'border-red-500' : ''}`}
            >
              <option value="">Select user</option>
              {users?.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Apartment</label>
            <select
              {...register('apartmentId', { required: 'Apartment is required' })}
              className={`form-select ${errors.apartmentId ? 'border-red-500' : ''}`}
            >
              <option value="">Select apartment</option>
              {apartments?.map(apartment => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.location} - ${apartment.price}
                </option>
              ))}
            </select>
            {errors.apartmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.apartmentId.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Booking Date</label>
            <input
              {...register('bookingDate', { required: 'Booking date is required' })}
              type="datetime-local"
              className={`form-input ${errors.bookingDate ? 'border-red-500' : ''}`}
            />
            {errors.bookingDate && (
              <p className="mt-1 text-sm text-red-600">{errors.bookingDate.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className={`form-select ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="">Select status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBookingMutation.isLoading || updateBookingMutation.isLoading}
              className="btn-primary"
            >
              {createBookingMutation.isLoading || updateBookingMutation.isLoading
                ? 'Saving...'
                : editingBooking ? 'Update Booking' : 'Create Booking'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingManagement;
