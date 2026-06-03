import React, { useState } from 'react';

export default function ChangeProfilePage({ currentUser, onProfileUpdated }) {
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    if (newPassword !== confirmPassword) {
      return setMessage({ text: 'Konfirmasi password baru tidak cocok!', isError: true });
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          newUsername: newUsername,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Username dan Password berhasil diubah! Silakan pakai data baru di login berikutnya.', isError: false });
        setNewPassword('');
        setConfirmPassword('');
        // Update state nama di navbar atas langsung secara realtime
        onProfileUpdated({ ...currentUser, username: newUsername });
      } else {
        setMessage({ text: data.message || 'Gagal mengubah profil.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Tidak bisa terhubung ke server.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#1f2937' }}>Pengaturan Akun</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px 0' }}>Ubah informasi data login administrator Anda di sini.</p>

        {message.text && (
          <div style={{ 
            backgroundColor: message.isError ? '#fee2e2' : '#ecfdf5', 
            color: message.isError ? '#dc2626' : '#059669', 
            padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', fontWeight: '600',
            border: message.isError ? '1px solid #fca5a5' : '1px solid #a7f3d0'
          }}>
            {message.isError ? '⚠️ ' : '✅ '} {message.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', display: 'block', marginBottom: '6px' }}>Username Baru</label>
            <input 
              type="text" 
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', display: 'block', marginBottom: '6px' }}>Password Baru</label>
            <input 
              type="password" 
              required
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', display: 'block', marginBottom: '6px' }}>Konfirmasi Password Baru</label>
            <input 
              type="password" 
              required
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '5px' }}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}