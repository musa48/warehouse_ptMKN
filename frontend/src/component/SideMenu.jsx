import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useUser } from '../contexts/UserContext';
import { HomeIcon, UserGroupIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, link: '/dashboard' }, 
  { name: 'List Barang', icon: UserGroupIcon, link: '/barang' }, 
  { name: 'IN/OUT Barang', icon: ArrowPathRoundedSquareIcon, link: '/transaksi' },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useUser();
  const [dateTime, setDateTime] = useState(new Date());

  const formatDate = (date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu"
    ];

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
    const year = date.getFullYear();

    return `${dayName}, ${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours} : ${minutes} : ${seconds}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
    localStorage.removeItem('JWTtoken'); 
      window.location.href = '/';
    }
  };

  return (
    <div className="w-80 bg-teal-700 text-white rounded-lg shadow-xl flex flex-col pt-3 h-full">
      <div className="px-5 mt-4 pb-5 mb-4 border-b border-teal-600 text-center">
        <div className="text-lg font-bold leading-none mb-1">
          PT. Mitra Kreasi Natural
        </div>
        <div className="text-4xl font-extrabold text-white tracking-wider">
          Warehouse
        </div>
      </div>
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isCurrent = location.pathname === item.link; 
          return (
            <Link
              key={item.link} to={item.link}
              className={`relative pr-8 pl-10 my-1 py-4 font-medium transition duration-150 ease-in-out cursor-pointer ${isCurrent ? 'bg-yellow-400 text-gray-900 font-bold rounded-l-full -mr-5 shadow-lg' : 'text-white hover:bg-teal-600 hover:text-white'}`}>
              <div className='flex items-center gap-6'>
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </div>
             </Link>
            );
          })}
        </nav>
      <div className='p-5 mt-auto'>
        <div className="flex items-center space-x-3 py-2 pl-8 pr-4 my-1 text-base font-medium text-white bg-teal-800 rounded-lg transition duration-150">
          <div>{formatDate(dateTime)}</div>
          <div className="font-semibold">{formatTime(dateTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;