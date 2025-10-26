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
  Eye,
  Building,
  MapPin,
  DollarSign,
  Home,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const ApartmentManagement = () => {
  const getBackendHost = () => {
    const base = api.defaults?.baseURL || '';
    return base.replace(/\/?api\/?$/i, '');
  };

  const resolveImageUrl = (apartment) => {
    const raw = (apartment.photoUrl || apartment.images || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    const host = getBackendHost();
    if (raw.startsWith('/')) return `${host}${raw}`;
    return `${host}/${raw}`;
  };
  const resolveRawImageUrl = (rawUrl) => {
    const raw = (rawUrl || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    const host = getBackendHost();
    if (raw.startsWith('/')) return `${host}${raw}`;
    return `${host}/${raw}`;
  };
  const isLikelyImageUrl = (url) => /\.(png|jpg|jpeg|gif|webp|svg)(\?|#|$)/i.test(url || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  // Fetch apartments
  const { data: apartments, isLoading } = useQuery(
    'apartments',
    async () => {
      const response = await api.get(endpoints.apartments);
      return response.data;
    }
  );

  // Create apartment mutation
  const createApartmentMutation = useMutation(
    async (apartmentData) => {
      const response = await api.post(endpoints.apartments, apartmentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apartments');
        toast.success('Apartment created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create apartment');
      }
    }
  );

  // Update apartment mutation
  const updateApartmentMutation = useMutation(
    async ({ id, apartmentData }) => {
      const response = await api.put(endpoints.apartmentById(id), apartmentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apartments');
        toast.success('Apartment updated successfully!');
        setIsModalOpen(false);
        setEditingApartment(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update apartment');
      }
    }
  );

  // Delete apartment mutation
  const deleteApartmentMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.apartmentById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apartments');
        toast.success('Apartment deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete apartment');
      }
    }
  );

  const onSubmit = (data) => {
    if (editingApartment) {
      updateApartmentMutation.mutate({ id: editingApartment.id, apartmentData: data });
    } else {
      createApartmentMutation.mutate(data);
    }
  };

  const handleEdit = (apartment) => {
    setEditingApartment(apartment);
    reset(apartment);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this apartment?')) {
      deleteApartmentMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApartment(null);
    reset();
  };

  // Filter apartments
  const filteredApartments = apartments?.filter(apartment => {
    const matchesSearch = apartment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.features?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'AVAILABLE' && apartment.available) ||
                         (statusFilter === 'UNAVAILABLE' && !apartment.available);
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner text="Loading apartments..." />;
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
          <h1 className="text-3xl font-bold text-gray-900">Apartment Management</h1>
          <p className="mt-2 text-gray-600">Manage apartment listings and properties</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Apartment</span>
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
                placeholder="Search apartments..."
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
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Apartments Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredApartments.map((apartment, index) => (
            <motion.div
              key={apartment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="relative">
                {/* Apartment Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {resolveImageUrl(apartment) ? (
                    <img
                      src={resolveImageUrl(apartment)}
                      alt={apartment.location}
                      className="w-full h-full object-cover rounded-lg"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        // eslint-disable-next-line no-console
                        console.warn('Image failed to load:', resolveImageUrl(apartment));
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+not+available';
                      }}
                    />
                  ) : (
                    <Home className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`status-badge ${
                    apartment.available ? 'status-active' : 'status-inactive'
                  }`}>
                    {apartment.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Apartment Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{apartment.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-gray-900">
                        ${apartment.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {apartment.size} sq ft
                    </div>
                  </div>

                  {apartment.features && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {apartment.features}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(apartment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(apartment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.assign(`/apartment-listing/${apartment.id}`)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Apartment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingApartment ? 'Edit Apartment' : 'Add New Apartment'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Location</label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className={`form-input ${errors.location ? 'border-red-500' : ''}`}
                placeholder="Enter apartment location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Price</label>
              <input
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                type="number"
                step="0.01"
                className={`form-input ${errors.price ? 'border-red-500' : ''}`}
                placeholder="Enter apartment price"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Size (sq ft)</label>
              <input
                {...register('size', { 
                  required: 'Size is required',
                  min: { value: 1, message: 'Size must be positive' }
                })}
                type="number"
                className={`form-input ${errors.size ? 'border-red-500' : ''}`}
                placeholder="Enter apartment size"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                {...register('available')}
                className="form-select"
              >
                <option value={true}>Available</option>
                <option value={false}>Unavailable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Features</label>
            <textarea
              {...register('features')}
              rows={3}
              className="form-textarea"
              placeholder="Enter apartment features (e.g., 2 bedrooms, 2 bathrooms, balcony, parking)"
            />
          </div>

          <div>
            <label className="form-label">Photo URL</label>
            <input
              {...register('photoUrl')}
              type="url"
              className="form-input"
              placeholder="Enter photo URL"
            />
            {watch('photoUrl') && (
              <div className="mt-2 flex items-center space-x-3">
                <img
                  src={resolveRawImageUrl(watch('photoUrl'))}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Img';
                  }}
                />
                {!isLikelyImageUrl(watch('photoUrl')) && (
                  <p className="text-sm text-amber-600">
                    Use a direct image link ending in .jpg, .png, etc. Some sites block hotlinking.
                  </p>
                )}
              </div>
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
              disabled={createApartmentMutation.isLoading || updateApartmentMutation.isLoading}
              className="btn-primary"
            >
              {createApartmentMutation.isLoading || updateApartmentMutation.isLoading
                ? 'Saving...'
                : editingApartment ? 'Update Apartment' : 'Create Apartment'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApartmentManagement;
