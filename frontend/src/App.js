import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryPage from './components/Inventory';
import TransactionsPage from './components/TransactionsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { isLoggedIn: false, role: 'guest' };
  });

  const handleLogin = (role) => {
    const authData = { isLoggedIn: true, role };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    setAuth({ isLoggedIn: false, role: 'guest' });
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      {!auth.isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="app-layout">
          <Sidebar onLogout={handleLogout} role={auth.role} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryPage role={auth.role} />} />
              <Route
                path="/transactions"
                element={auth.role === 'admin' ? <TransactionsPage /> : <Navigate to="/" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
