import React, { useState } from 'react';
import logoIconnet from '../assets/logo-iconnet.png';
import BASE_URL from '../utils/api';
import backgroundImage from '../assets/kantor.jpg';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user); // Lemparkan data {id, username} ke App.jsx
      } else {
        setError(data.message || 'Username atau password salah.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server backend. Pastikan server Laragon/Node.js aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Kartu Login Utama (Glassmorphism) */}
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.45)', 
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)', // Support Safari
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)', 
        width: '100%', 
        maxWidth: '380px', 
        textAlign: 'center', 
        border: '1px solid rgba(255, 255, 255, 0.6)' 
      }}>
        
        <div style={{ marginBottom: '20px' }}>
          <img src={logoIconnet} alt="Logo ICONNET" style={{ height: '45px', objectFit: 'contain' }} />
        </div>

        <h3 style={{ color: '#1f2937', margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700' }}>Portal BASTP</h3>
        <p style={{ color: '#4b5563', fontSize: '13px', margin: '0 0 24px 0' }}>Silakan masuk menggunakan akun administrator Anda.</p>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(254, 226, 226, 0.8)', 
            color: '#dc2626', 
            padding: '10px', 
            borderRadius: '10px', 
            fontSize: '13px', 
            marginBottom: '16px', 
            fontWeight: '600', 
            textAlign: 'left', 
            border: '1px solid rgba(252, 165, 165, 0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.8)', 
                fontSize: '14px', 
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.8)', 
                fontSize: '14px', 
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              placeholder="Masukkan password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              backgroundColor: '#007AFF', // Biru iOS/macOS asli
              color: '#ffffff', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              marginTop: '10px', 
              transition: 'background 0.2s, opacity 0.2s',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 14px 0 rgba(0, 122, 255, 0.25)'
            }}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          fontSize: '11px', 
          color: '#6b7280', 
          borderTop: '1px solid rgba(255, 255, 255, 0.4)', 
          paddingTop: '15px' 
        }}>
          Portal Database Auth &bull; 2026
        </div>
      </div>
    </div>
  );
}