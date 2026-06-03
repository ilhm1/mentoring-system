import React, { useState, useEffect } from 'react';
import {
  FiMonitor,
  FiEdit,
  FiPlus,
  FiList,
  FiTrash2
} from 'react-icons/fi';

export default function PerangkatPage() {
  // 1. STATE MANAGEMENT
  const [perangkatList, setPerangkatList] = useState([]);
  const [formData, setFormData] = useState({
    nama_perangkat: '',
    serial_number: '',
    status_perangkat: 'Tersedia'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // 2. AMBIL DATA DARI BACKEND
  const fetchPerangkat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/perangkat');
      if (response.ok) {
        const data = await response.json();
        setPerangkatList(data);
      }
    } catch (error) {
      showNotification('Gagal terhubung ke server backend', 'error');
    }
  };

  useEffect(() => {
    fetchPerangkat();
  }, []);

  // 3. FUNGSI NOTIFIKASI SEMENTARA
  const showNotification = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // 4. HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. HANDLE SIMPAN (TAMBAH & EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_perangkat || !formData.serial_number) {
      showNotification('Nama Perangkat dan SN wajib diisi!', 'error');
      return;
    }

    const url = isEditing 
      ? `http://localhost:5000/api/perangkat/${editId}` 
      : 'http://localhost:5000/api/perangkat';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(result.message, 'success');
        resetForm();
        fetchPerangkat(); // Refresh tabel
      } else {
        showNotification(result.message || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      showNotification('Gagal menyimpan data perangkat', 'error');
    }
  };

  // 6. TOMBOL EDIT DIKLIK
  const handleEditClick = (perangkat) => {
    setIsEditing(true);
    setEditId(perangkat.id);
    setFormData({
      nama_perangkat: perangkat.nama_perangkat,
      serial_number: perangkat.serial_number,
      status_perangkat: perangkat.status_perangkat
    });
  };

  // 7. TOMBOL HAPUS DIKLIK
  const handleDeleteClick = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus perangkat ini dari inventaris?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/perangkat/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok) {
          showNotification(result.message, 'success');
          fetchPerangkat();
        } else {
          showNotification(result.message, 'error');
        }
      } catch (error) {
        showNotification('Gagal menghapus perangkat', 'error');
      }
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({ nama_perangkat: '', serial_number: '', status_perangkat: 'Tersedia' });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>
        <>
          <FiMonitor style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Manajemen Inventaris Perangkat / Laptop
        </>
      </h2>

      {/* NOTIFIKASI */}
      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: message.type === 'success' ? '#2ecc71' : '#e74c3c'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        
        {/* PANEL KIRI: FORM INPUT */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#34495e' }}>
            <>
              {isEditing ? (
                <>
                  <FiEdit style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Edit Data Perangkat
                </>
              ) : (
                <>
                  <FiPlus style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Tambah Perangkat Baru
                </>
              )}
            </>
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Nama Perangkat / Spesifikasi</label>
              <input type="text" name="nama_perangkat" value={formData.nama_perangkat} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: Laptop ASUS ExpertBook B1" />
            </div>

            <div>
              <label style={labelStyle}>Serial Number (SN)</label>
              <input type="text" name="serial_number" value={formData.serial_number} onChange={handleInputChange} style={inputStyle} placeholder="Contoh: ASX-8820B" />
            </div>

            <div>
              <label style={labelStyle}>Status Perangkat</label>
              <select name="status_perangkat" value={formData.status_perangkat} onChange={handleInputChange} style={inputStyle}>
                <option value="Tersedia">🟢 Tersedia</option>
                <option value="Digunakan">🟡 Digunakan</option>
                <option value="Rusak">🔴 Rusak</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isEditing ? 'Perbarui' : 'Simpan'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} style={{ backgroundColor: '#95a5a6', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PANEL KANAN: TABEL DAFTAR ASET */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#34495e' }}>
            <>
              <FiList style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Daftar Aset Laptop
            </>
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1', color: '#2c3e50', borderBottom: '2px solid #bdc3c7' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nama Perangkat</th>
                <th style={thStyle}>Serial Number (SN)</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {perangkatList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>Belum ada data perangkat di database.</td>
                </tr>
              ) : (
                perangkatList.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f2f6', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#2c3e50' }}>
                        {item.nama_perangkat}
                        </td>
                    <td style={tdStyle}><code style={{backgroundColor:'#f1f2f6', padding:'3px 6px', borderRadius:'4px'}}>{item.serial_number}</code></td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: item.status_perangkat === 'Tersedia' ? '#2ecc71' : item.status_perangkat === 'Digunakan' ? '#f1c40f' : '#e74c3c'
                      }}>
                        {item.status_perangkat}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleEditClick(item)} style={{ backgroundColor: '#f1c40f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        <>
                          <FiEdit style={{ marginRight: '4px' }} />
                          Edit
                        </>
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        <>
                          <FiTrash2 style={{ marginRight: '4px' }} />
                          Hapus
                        </>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// STYLING MINI INTERN
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#34495e', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' };
const thStyle = { padding: '12px', fontSize: '14px', color: '#34495e' };
const tdStyle = { padding: '12px', fontSize: '13.5px', color: '#2c3e50' };