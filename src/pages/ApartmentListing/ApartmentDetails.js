import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { Home, MapPin, DollarSign, Package } from 'lucide-react';

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getBackendHost = () => {
    const base = api.defaults?.baseURL || '';
    return base.replace(/\/?api\/?$/i, '');
  };
  const resolveUrl = (rawUrl) => {
    const raw = (rawUrl || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    const host = getBackendHost();
    if (raw.startsWith('/')) return `${host}${raw}`;
    return `${host}/${raw}`;
  };

  const { data: apartment, isLoading } = useQuery(['apartment', id], async () => {
    const res = await api.get(endpoints.apartmentById(id));
    return res.data;
  });

  const { data: inventories } = useQuery(['inventories'], async () => {
    const res = await api.get(endpoints.inventory);
    const data = res.data;
    return Array.isArray(data) ? data : [];
  });

  if (isLoading) return <LoadingSpinner text="Loading apartment..." />;

  const inventory = (inventories || []).find((inv) => inv.apartment?.id === Number(id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            {resolveUrl(apartment?.photoUrl || apartment?.images) ? (
              <img
                src={resolveUrl(apartment?.photoUrl || apartment?.images)}
                alt={apartment?.location}
                className="w-full h-full object-cover rounded-lg"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            ) : (
              <Home className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{apartment?.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">${apartment?.price?.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-700">{apartment?.features}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Inventory</h3>
        {inventory ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-600" />
              <div className="text-sm text-gray-700">
                <div>Stock: {inventory.stock}</div>
                <div>Status: {inventory.status}</div>
              </div>
            </div>
            {(inventory.photoUrl) && (
              <img
                src={resolveUrl(inventory.photoUrl)}
                alt="Inventory"
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Img';
                }}
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No inventory info for this apartment.</p>
        )}
      </div>
    </div>
  );
};

export default ApartmentDetails;


