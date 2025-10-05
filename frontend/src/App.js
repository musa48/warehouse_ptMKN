import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserProvider, useUser  } from './contexts/UserContext';
import LayoutUtama from './component/LayoutUtama';
import Login from './component/FormLogin';
import Dashboard from './component/Dashboard';
import ListBarang from './component/ListBarang';
import PrivateRoute from './component/PrivateRoute';
import ListTransaksi from './component/ListTransaksi';

function AppContent() {
  const { user } = useUser ();
  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <LayoutUtama>
                <Dashboard />
              </LayoutUtama>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/barang" 
          element={
            <PrivateRoute>
              <LayoutUtama>
                <ListBarang />
              </LayoutUtama>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transaksi" 
          element={
            <PrivateRoute>
              <LayoutUtama>
                <ListTransaksi />
              </LayoutUtama>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;