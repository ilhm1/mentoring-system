import React, { useEffect, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUsers
} from 'react-icons/fi';

export default function PegawaiList({ onNavigate }) {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Ambil data dari Backend (Port 5000) saat halaman dibuka
  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/pegawai');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server backend.');
      }
      const data = await response.json();
      setPegawaiList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // 2. Fungsi untuk Menghapus Pegawai
  const handleDelete = async (nip, nama) => {
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus data pegawai: ${nama} (${nip})?`);
    if (!konfirmasi) return;

    try {
      const response = await fetch(`http://localhost:5000/api/pegawai/${nip}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Data pegawai berhasil dihapus!');
        fetchPegawai(); // Refresh isi tabel setelah berhasil menghapus
      } else {
        const errData = await response.json();
        alert(`❌ Gagal menghapus: ${errData.message}`);
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan jaringan saat mencoba menghapus data.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      
      {/* HEADER TABEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937' }}>
            <FiUsers
              style={{
                marginRight: '8px',
                verticalAlign: 'middle'
              }}
            />
            Kelola Data Karyawan
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Daftar perangkat bawan pegawai untuk auto-fill Berita Acara.</p>
        </div>
        <button 
          onClick={() => onNavigate('form')}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <>
            <FiPlus style={{ marginRight: '6px' }} />
            Tambah Pegawai Baru
          </>
        </button>
      </div>

      {/* STATE LOADING / ERROR */}
      {loading && <p style={{ textAlign: 'center', color: '#4b5563', padding: '20px' }}>⏳ Sedang memuat data dari database...</p>}
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>⚠️ Error: {error}</div>}

      {/* TABEL DATA */}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={thStyle}>NIP</th>
                <th style={thStyle}>Nama Pengguna</th>
                <th style={thStyle}>Jabatan</th>
                <th style={thStyle}>No. HP</th>
                <th style={thStyle}>Perangkat (SN)</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pegawaiList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af', padding: '30px' }}>
                    Belum ada data pegawai di database. Silakan tambah baru!
                  </td>
                </tr>
              ) : (
                pegawaiList.map((pegawai) => (
                  <tr key={pegawai.nip} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1e3a8a' }}>{pegawai.nip}</td>
                    <td style={tdStyle}>{pegawai.nama_pengguna}</td>
                    <td style={tdStyle}>{pegawai.jabatan_pengguna}</td>
                    <td style={tdStyle}>{pegawai.no_hp}</td>
                    <td style={tdStyle}>
                      <div>{pegawai.spesifikasi_perangkat}</div>
                      <small style={{ color: '#6b7280' }}>SN: {pegawai.serial_number}</small>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => onNavigate('form', pegawai.nip)}
                          style={{ ...actionBtnStyle, backgroundColor: '#f1c40f' }}
                          title="Ubah Data"
                        >
                          <>
                            <FiEdit />
                            Edit
                          </>
                        </button>
                        <button 
                          onClick={() => handleDelete(pegawai.nip, pegawai.nama_pengguna)}
                          style={{ ...actionBtnStyle, backgroundColor: '#e74c3c' }}
                          title="Hapus Data"
                        >
                          <>
                            <FiTrash2 />
                            Hapus
                          </>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// STYLING INTERN TABEL
const thStyle = { padding: '12px', fontWeight: '600', color: '#374151' };
const tdStyle = { padding: '12px', color: '#4b5563', verticalAlign: 'middle' };
const actionBtnStyle = {
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
  transition: 'opacity 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px'
};