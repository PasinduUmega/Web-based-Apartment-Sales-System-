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
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const InstallmentPlanManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const paymentId = watch('paymentId');
  const installments = watch('installments');
  const watchedMonthlyAmount = watch('monthlyAmount');

  // Fetch installment plans
  const { data: installmentPlans, isLoading } = useQuery(
    'installmentPlans',
    async () => {
      const response = await api.get(endpoints.installmentPlans);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }
  );

  // Fetch payments for dropdown
  const { data: payments } = useQuery('payments', async () => {
    const response = await api.get(endpoints.payments);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  });

  // Auto-calc: when paymentId or installments change, suggest 40% down and monthly amount
  React.useEffect(() => {
    if (!paymentId) return; // require selection
    const payment = (payments || []).find(p => String(p.id) === String(paymentId));
    if (!payment) return;
    const total = Number(payment.amount || 0);
    const down = total * 0.40; // 40% down payment
    const remaining = Math.max(total - down, 0);
    const months = Math.max(Number(installments || 0), 1);
    if (!months || !Number.isFinite(months)) return;
    const monthly = Number((remaining / months).toFixed(2));
    if (!Number.isNaN(monthly) && Number.isFinite(monthly) && Number(watchedMonthlyAmount || 0) !== monthly) {
      setValue('monthlyAmount', monthly, { shouldValidate: true, shouldDirty: true });
    }
  }, [paymentId, installments, payments, watchedMonthlyAmount, setValue]);

  // Create installment plan mutation
  const createInstallmentPlanMutation = useMutation(
    async (planData) => {
      const response = await api.post(endpoints.installmentPlans, planData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('installmentPlans');
        toast.success('Installment plan created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create installment plan');
      }
    }
  );

  // Update installment plan mutation
  const updateInstallmentPlanMutation = useMutation(
    async ({ id, planData }) => {
      const response = await api.put(endpoints.installmentPlanById(id), planData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('installmentPlans');
        toast.success('Installment plan updated successfully!');
        setIsModalOpen(false);
        setEditingPlan(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update installment plan');
      }
    }
  );

  // Delete installment plan mutation
  const deleteInstallmentPlanMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.installmentPlanById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('installmentPlans');
        toast.success('Installment plan deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete installment plan');
      }
    }
  );

  const onSubmit = (data) => {
    const payload = {
      payment: data.paymentId ? { id: Number(data.paymentId) } : null,
      installments: Number(data.installments),
      monthlyAmount: Number(data.monthlyAmount),
      schedule: data.schedule
    };
    if (editingPlan) {
      updateInstallmentPlanMutation.mutate({ id: editingPlan.id, planData: payload });
    } else {
      createInstallmentPlanMutation.mutate(payload);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    reset({
      paymentId: plan.payment?.id || '',
      installments: plan.installments || 1,
      monthlyAmount: plan.monthlyAmount || '',
      schedule: plan.schedule || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this installment plan?')) {
      deleteInstallmentPlanMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    reset();
  };

  // Filter installment plans
  const filteredPlans = installmentPlans?.filter(plan => {
    const matchesSearch = plan.payment?.booking?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.payment?.booking?.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner text="Loading installment plans..." />;
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
          <h1 className="text-3xl font-bold text-gray-900">Installment Plan Management</h1>
          <p className="mt-2 text-gray-600">Manage installment plans and payment schedules</p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Installment Plan</span>
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
                placeholder="Search installment plans..."
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
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Installment Plans Table */}
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
                <th className="table-header-cell">Payment</th>
                <th className="table-header-cell">Installments</th>
                <th className="table-header-cell">Monthly Amount</th>
                <th className="table-header-cell">Schedule</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <AnimatePresence>
                {filteredPlans.map((plan, index) => (
                  <motion.tr
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Payment #{plan.payment?.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {plan.payment?.booking?.apartment?.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{plan.installments}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-lg text-gray-900">
                          ${plan.monthlyAmount?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900">
                          {plan.schedule}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(plan.id)}
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

      {/* Installment Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlan ? 'Edit Installment Plan' : 'Add New Installment Plan'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Payment</label>
            <select
              {...register('paymentId', { required: 'Payment is required' })}
              className={`form-select ${errors.paymentId ? 'border-red-500' : ''}`}
            >
              <option value="">Select payment</option>
              {payments?.map(payment => (
                <option key={payment.id} value={payment.id}>
                  Payment #{payment.id} - ${payment.amount} - {payment.booking?.apartment?.location}
                </option>
              ))}
            </select>
            {errors.paymentId && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentId.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">40% down payment applied automatically. Monthly amount is calculated from remaining balance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Number of Installments</label>
              <input
                {...register('installments', { 
                  required: 'Number of installments is required',
                  min: { value: 1, message: 'Must be at least 1 installment' }
                })}
                type="number"
                className={`form-input ${errors.installments ? 'border-red-500' : ''}`}
                placeholder="Enter number of installments"
              />
              {errors.installments && (
                <p className="mt-1 text-sm text-red-600">{errors.installments.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Monthly Amount</label>
              <input
                {...register('monthlyAmount', { 
                  required: 'Monthly amount is required',
                  min: { value: 0.01, message: 'Amount must be positive' }
                })}
                type="number"
                step="0.01"
                className={`form-input ${errors.monthlyAmount ? 'border-red-500' : ''}`}
                placeholder="Enter monthly amount"
              />
              {errors.monthlyAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyAmount.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">Schedule</label>
            <textarea
              {...register('schedule', { required: 'Schedule is required' })}
              rows={3}
              className={`form-textarea ${errors.schedule ? 'border-red-500' : ''}`}
              placeholder="Enter payment schedule details (e.g., Monthly on 1st, Quarterly, etc.)"
            />
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule.message}</p>
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
              disabled={createInstallmentPlanMutation.isLoading || updateInstallmentPlanMutation.isLoading}
              className="btn-primary"
            >
              {createInstallmentPlanMutation.isLoading || updateInstallmentPlanMutation.isLoading
                ? 'Saving...'
                : editingPlan ? 'Update Installment Plan' : 'Create Installment Plan'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstallmentPlanManagement;
