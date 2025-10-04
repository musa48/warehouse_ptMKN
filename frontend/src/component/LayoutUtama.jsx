import React from 'react';
import Sidebar from './SideMenu';
import { useUser } from '../contexts/UserContext';
import { PowerIcon } from '@heroicons/react/24/outline';

const LayoutUtama = ({ children }) => {

  const { user,logout } = useUser();
  const handleLogout = () => {
    if (logout) {
        logout();
    } else {
    localStorage.removeItem('JWTtoken'); 
        window.location.href = '/';
    }
  };

  return (
    <div className="max-h-screen bg-teal-800 flex flex-col overflow-y-scroll h-screen">
      <div className="flex p-5 gap-5 h-fit">
        <Sidebar onLogout={logout}/>
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-end me-2 gap-4">
                    <span className="text-white font-semibold">{user?.nama_pengguna ? user.nama_pengguna : "Guest"}</span>
                    <div onClick={handleLogout} className="font-medium text-white cursor-pointer">
                        <PowerIcon className="h-6 w-6" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl px-6 py-4 flex flex-col h-[89vh]">
                    {children}
                </div>
            </div> 
        </div>
    </div>
  );
};

export default LayoutUtama;