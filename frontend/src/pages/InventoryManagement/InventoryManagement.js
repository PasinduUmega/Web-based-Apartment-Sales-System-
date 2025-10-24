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
  Package,
  Building,
  AlertCircle,
  CheckCircle,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const InventoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const getBackendHost = () => {
    const base = api.defaults?.baseURL || '';
    return base.replace(/\/?api\/?$/i, '');
  };

  const resolveImageUrl = (rawUrl) => {
    const raw = (rawUrl || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    const host = getBackendHost();
    if (raw.startsWith('/')) return `${host}${raw}`;
    return `${host}/${raw}`;
  };

  // Fetch inventory
  const { data: inventory, isLoading } = useQuery(
    'inventory',
    async () => {
      const response = await api.get(endpoints.inventory);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }
  );

  // Fetch apartments for dropdown
  const { data: apartments } = useQuery(
    'apartments',
    async () => {
      const response = await api.get(endpoints.apartments);
      return response.data;
    }
  );

  // Create inventory mutation
  const createInventoryMutation = useMutation(
    async (inventoryData) => {
      const response = await api.post(endpoints.inventory, inventoryData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventory');
        toast.success('Inventory item created successfully!');
        setIsModalOpen(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create inventory item');
      }
    }
  );

  // Update inventory mutation
  const updateInventoryMutation = useMutation(
    async ({ id, inventoryData }) => {
      const response = await api.put(endpoints.inventoryById(id), inventoryData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventory');
        toast.success('Inventory item updated successfully!');
        setIsModalOpen(false);
        setEditingInventory(null);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update inventory item');
      }
    }
  );

  // Delete inventory mutation
  const deleteInventoryMutation = useMutation(
    async (id) => {
      await api.delete(endpoints.inventoryById(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventory');
        toast.success('Inventory item deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete inventory item');
      }
    }
  );

  const onSubmit = (data) => {
    const payload = {
      apartment: data.apartmentId ? { id: Number(data.apartmentId) } : null,
      stock: Number(data.stock),
      status: data.status,
      photoUrl: data.photoUrl || null
    };
    if (editingInventory) {
      updateInventoryMutation.mutate({ id: editingInventory.id, inventoryData: payload });
      return;
    }
    // Prevent duplicate entry per apartment_id if backend enforces uniqueness
    const existing = (Array.isArray(inventory) ? inventory : []).find(
      (i) => i.apartment?.id === Number(data.apartmentId)
    );
    if (existing) {
      updateInventoryMutation.mutate({ id: existing.id, inventoryData: payload });
      toast.success('Updated existing inventory for this apartment');
    } else {
      createInventoryMutation.mutate(payload);
    }
  };

  const handleEdit = (inventoryItem) => {
    setEditingInventory(inventoryItem);
    reset(inventoryItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInventory(null);
    reset();
  };

  // Filter inventory
  const inventoryArray = Array.isArray(inventory) ? inventory : [];
  const filteredInventory = inventoryArray.filter(item => {
    const matchesSearch = item.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.status?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading inventory..." />;
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
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Manage apartment inventory and stock levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Inventory</span>
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
                placeholder="Search inventory..."
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
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Inventory Table */}
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
                <th className="table-header-cell">Apartment</th>
                <th className="table-header-cell">Stock</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Photo</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <AnimatePresence>
                {filteredInventory.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.apartment?.location}</p>
                          <p className="text-sm text-gray-500">ID: {item.apartment?.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{item.stock}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${
                        item.status === 'AVAILABLE' ? 'status-active' :
                        item.status === 'SOLD' ? 'status-inactive' :
                        'status-pending'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {(item.photoUrl || item.apartment?.photoUrl || item.apartment?.images) ? (
                        <img
                          src={resolveImageUrl(item.photoUrl || item.apartment?.photoUrl || item.apartment?.images)}
                          alt="Inventory"
                          className="w-12 h-12 object-cover rounded-lg"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            // eslint-disable-next-line no-console
                            console.warn('Inventory image failed:', item.photoUrl || item.apartment?.photoUrl || item.apartment?.images);
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/96x96?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(item.id)}
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

      {/* Inventory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingInventory ? 'Edit Inventory' : 'Add New Inventory'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="form-label">Stock Quantity</label>
            <input
              {...register('stock', { 
                required: 'Stock is required',
                min: { value: 0, message: 'Stock must be non-negative' }
              })}
              type="number"
              className={`form-input ${errors.stock ? 'border-red-500' : ''}`}
              placeholder="Enter stock quantity"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className={`form-select ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="">Select status</option>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Photo URL</label>
            <input
              {...register('photoUrl')}
              type="url"
              className="form-input"
              placeholder="Enter photo URL"
            />
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
              disabled={createInventoryMutation.isLoading || updateInventoryMutation.isLoading}
              className="btn-primary"
            >
              {createInventoryMutation.isLoading || updateInventoryMutation.isLoading
                ? 'Saving...'
                : editingInventory ? 'Update Inventory' : 'Create Inventory'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
