import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import FormTransaksiModal from './FormTransaksi';
import ic_sort from '../assets/ic_sort.png';
import api from '../api';

function ListTransaksi() {
    const { user } = useUser();
    const isAdmin = user?.role === 'admin'; 
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('tanggal_trans');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isTransaksiModalOpen, setIsTransaksiModalOpen] = useState(false);
    const openTransModal = () => setIsTransaksiModalOpen(true);
    const [isLoading, setIsLoading] = useState(true);
    const closeTransModal = () => setIsTransaksiModalOpen(false);
    const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);
    
    const fetchRiwayatTransaksi = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/transaksi"); 
            setRiwayatTransaksi(res.data); 
        } catch (error) {
            console.error("Error fetching riwayat transaksi:", error);
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRiwayatTransaksi(); 
    }, []);

    const handleTransSuccess = (newTransData) => {
        fetchRiwayatTransaksi(); 
        setRiwayatTransaksi(prevList => [newTransData, ...prevList]); 
        closeTransModal();
    };

    const filtered = riwayatTransaksi.filter(
        (tr) =>
            tr.tanggal_trans?.toLowerCase().includes(search.toLowerCase()) ||
            tr.jenis_trans?.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = filtered.length > 0 && sortKey ? [...filtered].sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (sortKey === 'tanggal_trans') {
            valA = new Date(valA);
            valB = new Date(valB);
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    }) : filtered;

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="ml-4 text-gray-600">Memuat list transaksi...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-3">Riwayat Transaksi</h2>
            <hr className="border-gray-800 dark:border-white mb-4"/>
            <div className="flex flex-row justify-between items-center mb-6 px-2">
                <div className="relative">
                    <input 
                        className="w-[40rem] p-2 pl-10 border-2 border-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search..." value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.44 4.19l3.41 3.41a1 1 0 1 1-1.42 1.42l-3.41-3.41A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className='flex space-x-3'>
                    <button
                        onClick={openTransModal}
                        className="flex items-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-lg transition duration-150">
                        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        Buat Transaksi Baru
                    </button>
                </div>
            </div>
            <table className="table-auto shadow-md w-full">
                <thead>
                    <tr className="border-2 border-teal-200 bg-teal-700 text-white">
                        <th onClick={() => handleSort('tanggal_trans')} className="border-2 py-2 border-indigo-500 cursor-pointer select-none">
                            <div className="flex justify-center items-center gap-2">
                                <span>Tanggal</span>
                                <img src={ic_sort} className="w-4 h-4" />
                            </div>
                        </th>
                        <th className="border-2 py-2 border-teal-500">Nama Barang</th>
                        <th className="border-2 py-2 border-teal-500">Jenis Transaksi</th>
                        <th className="border-2 py-2 border-teal-500">Jumlah</th>
                        <th className="border-2 py-2 border-teal-500">Dibuat Oleh</th>
                        <th className="border-2 py-2 border-teal-500">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {riwayatTransaksi.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-xl text-center py-6 text-gray-600">
                                Belum ada riwayat transaksi.
                            </td>
                        </tr>
                    ) : (
                      sorted.slice(0, 10).map((t, index) => (
                        <tr key={index} className='hover:bg-teal-50 transition'>
                            <td className="border-2 py-2 border-teal-500 px-2 text-center">
                                {new Date(t.tanggal_trans).toLocaleDateString()} 
                            </td>
                            <td className="border-2 py-2 border-teal-500 px-2">
                                {t.Barang ? t.Barang.nama_barang : 'N/A'} 
                            </td>
                            <td className={`border-2 py-2 border-teal-500 px-2 font-semibold text-center ${t.jenis_trans === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.jenis_trans.toUpperCase()}
                            </td>
                            <td className="border-2 py-2 border-teal-500 px-2 text-center">
                                {t.jumlah_barang}
                            </td>
                            <td className="border-2 py-2 border-teal-500 px-2 text-center">
                                {t.Pengguna ? t.Pengguna.nama_pengguna : 'N/A'}
                            </td>
                            <td className="border-2 py-2 border-teal-500 px-2">
                                {t.keterangan || '-'}
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
            <FormTransaksiModal 
                isOpen={isTransaksiModalOpen} 
                onClose={closeTransModal} 
                onSaveSuccess={handleTransSuccess} 
            />
        </div>
    );
}

export default ListTransaksi;