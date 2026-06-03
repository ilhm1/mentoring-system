import React, { useState, useEffect } from 'react';
import './App.css';
import MigoBapPage from './pages/MigoBapPage';
import PerangkatPage from './pages/PerangkatPage';
import PegawaiList from './pages/PegawaiList';
import PegawaiForm from './pages/PegawaiForm';
import LoginPage from './pages/LoginPage'; // Import halaman login

function App() {
  // State Otentikasi
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State Navigasi ('bap', 'list', 'form')
  const [currentPage, setCurrentPage] = useState('bap');
  const [selectedNip, setSelectedNip] = useState(null);

  // Cek apakah user sudah pernah login sebelumnya saat web dimuat
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigate = (page, nip = null) => {
    setCurrentPage(page);
    setSelectedNip(nip);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentPage('bap'); // Reset halaman
  };

  // JIKA BELUM LOGIN: Tampilkan hanya halaman login
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // JIKA SUDAH LOGIN: Tampilkan sistem penuh
  return (
    <div>
      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#1e293b', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Migo BAP System</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => handleNavigate('bap')} style={navBtnStyle(currentPage === 'bap')}>📄 Buat BAP</button>
          <button onClick={() => handleNavigate('list')} style={navBtnStyle(currentPage === 'list')}>👥 Kelola Karyawan</button>
          <button onClick={handleLogout} style={{ ...navBtnStyle(false), backgroundColor: '#ef4444', color: 'white' }}>🚪 Logout</button>
        </div>
      </nav>

      {/* AREA KONTEN HALAMAN */}
      <div style={{ padding: '20px' }}>
        {currentPage === 'bap' && <MigoBapPage />}
        {currentPage === 'list' && <PegawaiList onNavigate={handleNavigate} />}
        {currentPage === 'form' && <PegawaiForm nip={selectedNip} onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}

const navBtnStyle = (isActive) => ({
  backgroundColor: isActive ? '#3b82f6' : 'transparent',
  color: isActive ? 'white' : '#cbd5e1',
  border: isActive ? 'none' : '1px solid #cbd5e1',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.2s'
});

export default App;