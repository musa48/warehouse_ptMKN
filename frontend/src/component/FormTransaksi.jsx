import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; 
import { useUser } from '../contexts/UserContext';
import api from '../api';

const FormTransaksiModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const token = localStorage.getItem('JWTtoken');
    const [isLoading, setIsLoading] = useState(false);
    const [barangList, setBarangList] = useState([]);
    const { user } = useUser();
    const userID = user?.user_id;
    const [formData, setFormData] = useState({ 
        tanggal_trans: new Date().toISOString().split('T')[0],
        barang_id: '',
        jenis_trans: 'in',
        jumlah_barang: 0,
        keterangan: '',
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                tanggal_trans: new Date().toISOString().split('T')[0],
                barang_id: '',
                jenis_trans: 'in',
                jumlah_barang: 0,
                keterangan: '',
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const fetchBarangList = async () => {
            try {
                const res = await api.get("/barang");
                setBarangList(res.data);
                console.log("Data barangList dari API:", res.data);
            } catch (err) {
                console.error('Failed to fetch list barang :', err);
            }
        };

        fetchBarangList();
    }, [isOpen, token]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`[Input Change] Field: ${name}, Nilai Mentah (string): ${value}`);
        let processedValue = value;
        if (name === 'jumlah_barang') {
            processedValue = Number(value); 
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: processedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userID) {
            console.error("User ID tidak ditemukan.");
            alert("User Id tidak ditemukan.");
            setIsLoading(false);
            return;
        }
        if (formData.barang_id === '' || formData.barang_id === 0) {
            alert('Silakan pilih barang anda.');
            setIsLoading(false);
            return;
        }
        if (!token) {
            alert('Token tidak ditemukan.');
            setIsLoading(false);
            return;
        }
        const datafinal = {
            ...formData,
            user_id: Number(userID)
        };
        try {
            const response = await api.post('/transaksi', datafinal, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 201 || response.status === 200) {
                console.log('Transaksi berhasil disimpan:', response.data); 
                if (onSaveSuccess) {
                    onSaveSuccess(response.data); 
                }
                
                setFormData(prev => ({ ...prev, jenis_trans: 'masuk', jumlah_barang: 0 }));
                onClose(); 
            } else {
                alert(`Gagal menyimpan: ${response.statusText}`);
            }
        } catch (err) {
            console.error('API Error:', err.response ? err.response.data : err.message);
            alert(err.response?.data?.message || 'Terjadi kesalahan saat menghubungi server.');
        } finally {
            setIsLoading(false);
        }
    };
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300" onClick={isLoading ? null : onClose} >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6" onClick={(e) => e.stopPropagation()} >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Form IN/OUT Barang</h2>
                    <button onClick={onClose} disabled={isLoading} className={`text-gray-400 hover:text-gray-600 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="tanggal_trans" className="block text-sm font-medium text-gray-700">Tanggal Transaksi</label>
                        <input
                            type="date" name="tanggal_trans"
                            value={formData.tanggal_trans}
                            onChange={handleInputChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                        <label htmlFor="barang_id" className="block text-sm font-medium text-gray-700">Nama Barang</label>
                        <select
                            name="barang_id" value={formData.barang_id}
                            onChange={handleInputChange} required
                            disabled={isLoading || barangList.length === 0}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-50"
                        >
                            <option value="" disabled>Pilih Barang</option>
                            {barangList.length === 0 ? (
                                <option value="" disabled>Memuat list barang...</option>
                            ) : (
                                barangList.map((barang) => (
                                    <option key={barang.barang_id} value={barang.barang_id}> 
                                        {/* {barang.barang_id} */}
                                        {barang.nama_barang} - Stok : {barang.stok}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
                            <div className="flex space-x-6">
                                <div className="flex items-center">
                                    <input
                                        name="jenis_trans"
                                        type="radio"
                                        value="in"
                                        checked={formData.jenis_trans === 'in'}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                                    />
                                    <label htmlFor="trans_masuk" className="ml-2 block text-sm font-medium text-gray-700">
                                        Barang Masuk
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        name="jenis_trans"
                                        type="radio"
                                        value="out"
                                        checked={formData.jenis_trans === 'out'}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <label htmlFor="trans_keluar" className="ml-2 block text-sm font-medium text-gray-700">
                                        Barang Keluar
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="jumlah_barang" className="block text-sm font-medium text-gray-700">Jumlah Barang</label>
                            <input
                                type="number"
                                name="jumlah_barang"
                                value={formData.jumlah_barang}
                                onChange={handleInputChange}
                                required
                                min="1"
                                disabled={isLoading}
                                className="mt-1 block w-40 rounded-md border border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="jumlah_barang" className="block text-sm font-medium text-gray-700">Keterangan</label>
                        <textarea
                            type="text"
                            name="keterangan"
                            rows="3"
                            value={formData.keterangan}
                            onChange={handleInputChange}
                            required
                            min="1"
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-50"
                        />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3 border-t">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50" >Batal
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 shadow-lg disabled:opacity-50 flex items-center" >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTransaksiModal;