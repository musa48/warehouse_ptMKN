import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [user, setUser ] = useState(null);  
  const [isLoading, setIsLoading] = useState(true); 
  
  // Fungsi login
  const login = (JWTtoken, userData) => {
    localStorage.setItem('JWTtoken', JWTtoken);
    try {
      const decoded = jwtDecode(JWTtoken);
      setUser ({ ...userData });
    } catch (error) {
      console.error("Login: Token decoding failed", error);
      setUser(null);
    }
    setIsLoading(false);
  };

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('JWTtoken');
    setUser (null);
    setIsLoading(false);
  };

  const checkAuth = () => {
    setIsLoading(true);
    const JWTtoken = localStorage.getItem('JWTtoken');
    if (!JWTtoken) {
        setUser(null);
        setIsLoading(false);
        return;
    }
    try {
      const decoded = jwtDecode(JWTtoken);
      setUser ({ user_id: decoded.user_id,nama_pengguna: decoded.nama_pengguna, username: decoded.username, role: decoded.role });
    } catch (error) {
      console.error("checkAuth: Token invalid", error);
      logout();
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </UserContext.Provider>
  );
};