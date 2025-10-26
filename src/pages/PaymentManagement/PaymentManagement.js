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
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const PaymentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Fetch payments
  const { data: payments, isLoading } = useQuery(
    'payments',
    async () => {
      const response = await api.get(endpoints.payments);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }
  );

  // Fetch bookings for dropdown
  const { data: bookings } = useQuery('bookings', async () => {
    const response = await api.get(endpoints.bookings);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  });

  // Create payment mutation
  const createPaymentMutation = useMutation(
    async (paymentData) => {
      const response = await api.post(endpoints.payments, paymentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('payments');
        toast.success('Payment created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create payment');
      }
    }
  );

  // Update payment mutation
  const updatePaymentMutation = useMutation(
    async ({ id, paymentData }) => {
      const response = await api.put(endpoints.paymentById(id), paymentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('payments');
        toast.success('Payment updated successfully!');
        setIsModalOpen(false);
        setEditingPayment(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update payment');
      }
    }
  );

  // Delete payment mutation
  const deletePaymentMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.paymentById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('payments');
        toast.success('Payment deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete payment');
      }
    }
  );

  const onSubmit = (data) => {
    const payload = {
      booking: data.bookingId ? { id: Number(data.bookingId) } : null,
      amount: Number(data.amount),
      paymentDate: data.paymentDate ? new Date(data.paymentDate).toISOString() : null,
      status: data.status
    };
    if (editingPayment) {
      updatePaymentMutation.mutate({ id: editingPayment.id, paymentData: payload });
    } else {
      createPaymentMutation.mutate(payload);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    reset(payment);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deletePaymentMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
    reset();
  };

  // Filter payments
  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.booking?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.booking?.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner text="Loading payments..." />;
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="mt-2 text-gray-600">Manage payments and transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Payment</span>
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
                placeholder="Search payments..."
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
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Payments Table */}
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
                <th className="table-header-cell">Booking</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Agent 10%</th>
                <th className="table-header-cell">Payment Date</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <AnimatePresence>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Booking #{payment.booking?.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.booking?.apartment?.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-lg text-gray-900">
                          ${payment.amount?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">
                          ${(Number(payment.amount || 0) * 0.10).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${
                        payment.status === 'COMPLETED' ? 'status-active' :
                        payment.status === 'PENDING' ? 'status-pending' :
                        payment.status === 'FAILED' ? 'status-inactive' :
                        'status-completed'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(payment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(payment.id)}
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

      {/* Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Booking</label>
            <select
              {...register('bookingId', { required: 'Booking is required' })}
              className={`form-select ${errors.bookingId ? 'border-red-500' : ''}`}
            >
              <option value="">Select booking</option>
              {bookings?.map(booking => (
                <option key={booking.id} value={booking.id}>
                  Booking #{booking.id} - {booking.apartment?.location} - ${booking.apartment?.price}
                </option>
              ))}
            </select>
            {errors.bookingId && (
              <p className="mt-1 text-sm text-red-600">{errors.bookingId.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Amount</label>
            <input
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be positive' }
              })}
              type="number"
              step="0.01"
              className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="Enter payment amount"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Payment Date</label>
            <input
              {...register('paymentDate', { required: 'Payment date is required' })}
              type="datetime-local"
              className={`form-input ${errors.paymentDate ? 'border-red-500' : ''}`}
            />
            {errors.paymentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>
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
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
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
              disabled={createPaymentMutation.isLoading || updatePaymentMutation.isLoading}
              className="btn-primary"
            >
              {createPaymentMutation.isLoading || updatePaymentMutation.isLoading
                ? 'Saving...'
                : editingPayment ? 'Update Payment' : 'Create Payment'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
