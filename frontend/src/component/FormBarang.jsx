import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../api';

const FormBarangModal = ({ isOpen, onClose, onSaveSuccess, existingData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('JWTtoken');

  const [formData, setFormData] = useState({
    nama_barang: '',
    no_sku: '',
    stok: 0,
    lokasi_rak: '',
  });

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else {
      setFormData({ nama_barang: '', no_sku: '', stok: 0, lokasi_rak: '' });
    }
  }, [existingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stok' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (existingData) {
        response = await api.put(`/barang/${existingData.barang_id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await api.post('/barang', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      if (response.status === 200 || response.status === 201) {
        onSaveSuccess?.(response.data);
        onClose();
      }
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={isLoading ? null : onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {existingData ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h2>
          <button onClick={onClose} disabled={isLoading}>
            <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
            <input
              name="nama_barang"
              type="text"
              value={formData.nama_barang}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No. SKU</label>
            <input
              name="no_sku"
              type="text"
              value={formData.no_sku}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Stok</label>
              <input
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleInputChange}
                required
                min="0"
                disabled={!!existingData}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi Rak</label>
              <input
                name="lokasi_rak"
                type="text"
                value={formData.lokasi_rak}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {isLoading ? 'Menyimpan...' : existingData ? 'Update Barang' : 'Simpan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormBarangModal;
