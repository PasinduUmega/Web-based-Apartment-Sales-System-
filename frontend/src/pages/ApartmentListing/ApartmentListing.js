import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../services/api';
import {
  Search,
  MapPin,
  DollarSign,
  Home,
  Star,
  Filter,
  Heart,
  Eye,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const ApartmentListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sizeRange, setSizeRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState('grid');

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

  // Fetch apartments
  const { data: apartments, isLoading } = useQuery(
    'apartments',
    async () => {
      const response = await api.get(endpoints.apartments);
      return response.data;
    }
  );

  // Filter and sort apartments
  const filteredApartments = apartments?.filter(apartment => {
    const matchesSearch = apartment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.features?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = (!priceRange.min || apartment.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || apartment.price <= parseFloat(priceRange.max));
    const matchesSize = (!sizeRange.min || apartment.size >= parseInt(sizeRange.min)) &&
                       (!sizeRange.max || apartment.size <= parseInt(sizeRange.max));
    return matchesSearch && matchesPrice && matchesSize;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'size':
        return b.size - a.size;
      case 'location':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Apartment Listings</h1>
          <p className="mt-2 text-gray-600">Find your perfect apartment</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search</label>
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

          <div>
            <label className="form-label">Min Price</label>
            <input
              type="number"
              placeholder="Min price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Max Price</label>
            <input
              type="number"
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="price">Price</option>
              <option value="size">Size</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-gray-600">
          Showing {filteredApartments.length} apartments
        </p>
      </motion.div>

      {/* Apartments Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        <AnimatePresence>
          {filteredApartments.map((apartment, index) => (
            <motion.div
              key={apartment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`card ${viewMode === 'list' ? 'flex flex-row' : ''}`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div className="relative">
                  {/* Apartment Image */}
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative">
                    {resolveImageUrl(apartment) ? (
                      <img
                        src={resolveImageUrl(apartment)}
                        alt={apartment.location}
                        className="w-full h-full object-cover rounded-lg"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          // Log failing URL to help debugging broken links or hotlink protection
                          // eslint-disable-next-line no-console
                          console.warn('Image failed to load:', resolveImageUrl(apartment));
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+not+available';
                        }}
                      />
                    ) : (
                      <Home className="w-12 h-12 text-gray-400" />
                    )}
                    
                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </motion.button>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`status-badge ${
                        apartment.available ? 'status-active' : 'status-inactive'
                      }`}>
                        {apartment.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
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
                        <span className="text-2xl font-bold text-gray-900">
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
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/apartment-listing/${apartment.id}`)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/bookings')}
                          className="btn-secondary text-sm px-4 py-2"
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex w-full">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <Home className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{apartment.location}</h3>
                        <p className="text-sm text-gray-600 mt-1">{apartment.features}</p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-lg">${apartment.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Home className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{apartment.size} sq ft</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/apartment-listing/${apartment.id}`)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/bookings')}
                          className="btn-secondary text-sm px-4 py-2"
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredApartments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No apartments found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default ApartmentListing;
