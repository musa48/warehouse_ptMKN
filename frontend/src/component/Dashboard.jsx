import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../api';
const STOCK_THRESHOLD = 10;

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition duration-300 hover:shadow-lg">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 uppercase">{title}</span>
                <div className="flex flex-row items-end">
                    <span className={`text-3xl font-bold mt-1 text-${color}-700`}>{value}</span>
                    <span className={`ms-2 text-2xl font-bold mt-1 text-${color}-700`}>Barang</span>
                </div>
            </div>
            <div className={`p-3 rounded-full bg-${color}-100 bg-opacity-75 text-${color}-600 text-opacity-100`}>
                {icon}
            </div>
        </div>
    );
};

const LowStockList = ({ lowStockItems }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-red-600 flex items-center mb-4 border-b pb-2">
                <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                Lower Stok (Dibawah 10)
            </h3>
            {lowStockItems.length === 0 ? (
                <p className="text-green-600 font-medium">Semua stok barang aman. Bagus!</p>
            ) : (
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {lowStockItems.map((item) => (
                        <li key={item.id} className="py-3 flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{item.nama_barang}</span>
                            <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                                Stok: {item.stok}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const DashboardPage = () => {
    const [stats, setStats] = useState({ inThisWeek: 0, outThisWeek: 0 });
    const [chartData, setChartData] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboard = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/dashboard");
            console.log("Response:", response.data);
            const result = response.data[0];
            if (!result) {
                throw new Error("Data dashboard kosong");
            }

            setStats(result.stats);
            setChartData(result.chartData);
            setLowStockItems(result.lowStockItems);
        } catch (error) {
            console.error("Gagal server:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="ml-4 text-gray-600">Memuat data dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 overflow-y-scroll">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Statistic Data Warehouse</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Barang Masuk (Minggu Ini)" 
                    value={stats.inThisWeek} 
                    icon={<ArrowUpIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard 
                    title="Total Barang Keluar (Minggu Ini)" 
                    value={stats.outThisWeek} 
                    icon={<ArrowDownIcon className="w-6 h-6" />}
                    color="red"
                />
                <StatCard 
                    title="Item Stok Kritis" 
                    value={lowStockItems.length} 
                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                    color="yellow"
                />
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-96">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Grafik Transaksi (7 Hari Terakhir)</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                            formatter={(value, name) => [`${value} Transaksi`, name === 'masuk' ? 'Barang Masuk' : 'Barang Keluar']}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="masuk" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} name="Barang Masuk" />
                        <Line type="monotone" dataKey="keluar" stroke="#EF4444" strokeWidth={2} name="Barang Keluar" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <LowStockList lowStockItems={lowStockItems} />
            </div>
        </div>
    );
};

export default DashboardPage;