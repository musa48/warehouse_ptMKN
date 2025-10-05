import React, { useEffect, useState } from 'react';
import { useUser  } from '../contexts/UserContext';
import FormBarangModal from './FormBarang';
import ic_sort from '../assets/ic_sort.png';
import api from '../api';

function ListBarang() {
  const { user } = useUser ();
  const token = localStorage.getItem('JWTtoken');
  const isAdmin = user?.role === 'admin';
  const [barangList, setBarangList] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('nama_barang');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const closeModal = () => setIsModalOpen(false);
  const openCreateModal = () => {
    setSelectedBarang(null);
    setIsModalOpen(true);
  };
  const openEditModal = (barang) => {
    setSelectedBarang(barang);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = async () => {
      fetchBarang(); 
  };
  
  const fetchBarang = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/barang");
      setBarangList(res.data);
    } catch (error) {
      console.error("Error fetching barang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (barangId) => {
    if (!window.confirm("Yakin ingin menghapus barang ini?")) return;

    try {
      await api.delete(`/barang/${barangId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Data barang berhasil dihapus!");
      handleSaveSuccess();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus barang.");
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const filtered = barangList.filter(
    (b) =>
      b.nama_barang?.toLowerCase().includes(search.toLowerCase()) ||
      b.no_sku?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted =
    filtered.length > 0 && sortKey
      ? [...filtered].sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
          return 0;
        })
      : filtered;

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
            <p className="ml-4 text-gray-600">Memuat list barang...</p>
        </div>
    );
  }

  return (
    <div>
        <h2 className="text-3xl font-bold mb-3">List Barang</h2>
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
          {isAdmin && (
            <button
                onClick={openCreateModal}
                className="flex items-center px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 shadow-lg transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                    <path fillRule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>Tambah Barang
            </button>
          )}
        </div>
        <table className="table-auto shadow-md border-2 border-teal-500 w-full">
          <thead>
            <tr className="border-2 border-teal-200 bg-teal-700 text-white">
                <th className="justify-center items-center border-2 py-2 border-teal-500 cursor-pointer select-none" onClick={() => handleSort('nama_barang')}>
                  <div className="flex justify-center items-center gap-2">
                    <span>Nama Barang</span>
                    <img src={ic_sort} className="w-4 h-4" />
                </div>
                </th>
                <th className="justify-center items-center border-2 py-2 border-teal-500 cursor-pointer select-none" onClick={() => handleSort('no_sku')}>
                  <div className="flex justify-center items-center gap-2">
                    <span>No. SKU</span>
                    <img src={ic_sort} className="w-4 h-4"/>
                  </div>
                </th>
                <th className="border-2 py-2 border-teal-500 cursor-pointer select-none" onClick={() => handleSort('stok')}>
                  <div className="flex justify-center items-center gap-2">
                    <span>Stok</span>
                    <img src={ic_sort} className="w-4 h-4"/>
                  </div>
                </th>
                <th className="border-2 py-2 border-teal-500">Lokasi Rak</th>
                {isAdmin && (<th className="border-2 py-2 border-teal-500">Action</th> )}
            </tr>
          </thead>
          <tbody>
           {sorted.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-2xl text-center py-6">
                  List barang tidak ditemukan
                </td>
              </tr>
           ):(
            sorted.map(b => (
              <tr key={b.barang_id}>
                <td className="border-2 py-2 border-teal-500">{b.nama_barang}</td>
                <td className="border-2 py-2 border-teal-500">{b.no_sku}</td>
                <td className="border-2 py-2 border-teal-500">{b.stok}</td>
                <td className="border-2 py-2 border-teal-500">{b.lokasi_rak}</td>
                {isAdmin && (
                  <td className="border-2 py-2 border-teal-500">
                    <div className="flex items-center justify-center gap-4">
                      <button className="bg-green-400 py-1 px-4 rounded-xl text-white font-semibold text-md" onClick={() => openEditModal(b)}>Edit</button>
                      <button className="bg-red-400 py-1 px-4 rounded-xl text-white font-semibold text-md" onClick={() => handleDelete(b.barang_id)}>Hapus</button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
          </tbody>
        </table>
        {!isAdmin && <h2 className="text-lg font-semibold mt-4">Anda adalah staff. Hubungi admin untuk edit atau tambah barang.</h2>}
        <FormBarangModal isOpen={isModalOpen} onClose={closeModal} onSaveSuccess={handleSaveSuccess} existingData={selectedBarang} />
    </div>
  );
}
export default ListBarang;
