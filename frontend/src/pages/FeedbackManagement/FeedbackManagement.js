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
  MessageSquare,
  Star,
  User,
  Building,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const FeedbackManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Fetch feedbacks
  const { data: feedbacks, isLoading } = useQuery(
    'feedbacks',
    async () => {
      const response = await api.get(endpoints.feedbacks);
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

  // Create feedback mutation
  const createFeedbackMutation = useMutation(
    async (feedbackData) => {
      const response = await api.post(endpoints.feedbacks, feedbackData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feedbacks');
        toast.success('Feedback created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create feedback');
      }
    }
  );

  // Update feedback mutation
  const updateFeedbackMutation = useMutation(
    async ({ id, feedbackData }) => {
      const response = await api.put(endpoints.feedbackById(id), feedbackData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feedbacks');
        toast.success('Feedback updated successfully!');
        setIsModalOpen(false);
        setEditingFeedback(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update feedback');
      }
    }
  );

  // Delete feedback mutation
  const deleteFeedbackMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.feedbackById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feedbacks');
        toast.success('Feedback deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete feedback');
      }
    }
  );

  const onSubmit = (data) => {
    const payload = {
      user: data.userId ? { id: Number(data.userId) } : null,
      apartment: data.apartmentId ? { id: Number(data.apartmentId) } : null,
      rating: Number(data.rating),
      comment: data.comment
    };
    if (editingFeedback) {
      updateFeedbackMutation.mutate({ id: editingFeedback.id, feedbackData: payload });
    } else {
      createFeedbackMutation.mutate(payload);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    reset(feedback);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedbackMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeedback(null);
    reset();
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks?.filter(feedback => {
    const matchesSearch = feedback.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'ALL' || feedback.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  }) || [];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading feedbacks..." />;
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
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="mt-2 text-gray-600">Manage user feedbacks and reviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Feedback</span>
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
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feedbacks Table */}
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
                <th className="table-header-cell">Rating</th>
                <th className="table-header-cell">Comment</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <AnimatePresence>
                {filteredFeedbacks.map((feedback, index) => (
                  <motion.tr
                    key={feedback.id}
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
                          <p className="font-medium text-gray-900">{feedback.user?.username}</p>
                          <p className="text-sm text-gray-500">{feedback.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{feedback.apartment?.location}</p>
                          <p className="text-sm text-gray-500">${feedback.apartment?.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1">
                        {renderStars(feedback.rating)}
                        <span className="ml-2 text-sm text-gray-600">({feedback.rating}/5)</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {feedback.comment}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(feedback)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(feedback.id)}
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

      {/* Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="form-label">Rating</label>
            <select
              {...register('rating', { required: 'Rating is required' })}
              className={`form-select ${errors.rating ? 'border-red-500' : ''}`}
            >
              <option value="">Select rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Comment</label>
            <textarea
              {...register('comment', { required: 'Comment is required' })}
              rows={4}
              className={`form-textarea ${errors.comment ? 'border-red-500' : ''}`}
              placeholder="Enter your feedback comment"
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
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
              disabled={createFeedbackMutation.isLoading || updateFeedbackMutation.isLoading}
              className="btn-primary"
            >
              {createFeedbackMutation.isLoading || updateFeedbackMutation.isLoading
                ? 'Saving...'
                : editingFeedback ? 'Update Feedback' : 'Create Feedback'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
