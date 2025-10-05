import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const PrivateRoute = ({ children, roles = null }) => {
  const { user, isLoading } = useUser(); 
  const token = localStorage.getItem('JWTtoken');
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-teal-700">Memuat...</div>; 
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
  }
    
  return children;
};

export default PrivateRoute;