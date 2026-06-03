import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import MigoBapPage from './pages/MigoBapPage';
import MigoMonitoringPage from './pages/MigoMonitoringPage';

import { FiFileText, FiUsers, FiLogOut } from 'react-icons/fi';
import logoIconnet from './assets/logo-iconnet.png';

export default function App() {
  // Cek apakah sebelumnya sudah login
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('migoUserSession');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('migoUserSession', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('migoUserSession');
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            
            {/* NAVBAR */}
            <nav style={{ backgroundColor: '#ffffff', padding: '12px 24px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 1000 }}>
              <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
                <img src={logoIconnet} alt="Logo ICONNET" style={{ height: '38px', objectFit: 'contain' }} />
              </div>
              
              <Link to="/" style={navLinkStyle}>
                <FiFileText size={17} style={{ marginRight: '5px' }} /> Cari & Tambah BASTP
              </Link>
              
              <Link to="/monitoring" style={navLinkStyle}>
                <FiUsers size={17} style={{ marginRight: '5px' }} /> Monitoring
              </Link>

              {/* INFO ADMIN & LOGOUT */}
              <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid #e5e7eb', paddingLeft: '16px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block' }}>{user.username}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Administrator</span>
                </div>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  <FiLogOut size={15} style={{ marginRight: '5px' }} /> Logout
                </button>
              </div>
            </nav>

            {/* ROUTER CONTENT CONTAINER */}
            <div style={{ flex: 1, backgroundColor: '#f9fafb' }}>
              <Routes>
                <Route path="/" element={<MigoBapPage />} />
                <Route path="/monitoring" element={<MigoMonitoringPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            
          </div>
        </Router>
      )}
    </>
  );
}

const navLinkStyle = { color: '#4b5563', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 12px', display: 'flex', alignItems: 'center' };
const logoutButtonStyle = { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' };