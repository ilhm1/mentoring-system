import React, { useState, useEffect } from 'react';
import {
  FiUserPlus,
  FiEdit,
  FiSave,
  FiX
} from 'react-icons/fi';

export default function PegawaiForm({ nip, onNavigate }) {
  const isEditMode = !!nip; // Jika ada NIP, berarti sedang dalam mode EDIT

  // State Form sesuai dengan struktur tabel MySQL kita
  const [formData, setFormData] = useState({
    nip: '',
    nama_pengguna: '',
    jabatan_pengguna: '',
    no_hp: '',
    kedudukan_pengguna: '',
    // spesifikasi_perangkat: '',
    // serial_number: ''
  });

  const [loading, setLoading] = useState(false);

  // 1. JIKA MODE EDIT: Ambil data pegawai lama dari backend berdasarkan NIP
  useEffect(() => {
    if (isEditMode) {
      const fetchDetailPegawai = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/pegawai/detail/${nip}`);
          if (!response.ok) {
            throw new Error('Gagal mengambil detail data pegawai');
          }
          const data = await response.json();
          // Masukkan data dari MySQL ke dalam State Form
          setFormData({
            nip: data.nip || '',
            nama_pengguna: data.nama_pengguna || '',
            jabatan_pengguna: data.jabatan_pengguna || '',
            no_hp: data.no_hp || '',
            kedudukan_pengguna: data.kedudukan_pengguna || '',
            spesifikasi_perangkat: data.spesifikasi_perangkat || '',
            serial_number: data.serial_number || ''
          });
        } catch (error) {
          alert(`⚠️ Error: ${error.message}`);
          onNavigate('list'); // Kembalikan ke halaman tabel jika data gagal diambil
        }
      };

      fetchDetailPegawai();
    }
  }, [nip, isEditMode, onNavigate]);

  // 2. Mengurus Perubahan Input Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Mengirim Data ke Backend (Simpan / Perbarui)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi sederhana
if (!formData.nip || !formData.nama_pengguna) {
  alert('⚠️ Mohon isi NIP dan Nama Karyawan!');
  return;
}

    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/pegawai/${nip}` // Endpoint UPDATE
        : 'http://localhost:5000/api/pegawai';      // Endpoint CREATE
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message}`);
        onNavigate('list'); // Kembali ke halaman tabel setelah sukses
      } else {
        // Menangani pesan error duplikat NIP / Serial Number dari backend
        alert(`❌ Gagal: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan koneksi ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      
      {/* HEADER FORM */}
      <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1f2937' }}>
          <>
            {isEditMode ? (
              <>
                <FiEdit
                  style={{
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}
                />
                Edit Data Karyawan
              </>
            ) : (
              <>
                <FiUserPlus
                  style={{
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}
                />
                Tambah Karyawan Baru
              </>
            )}
          </>
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '13.5px' }}>
          {isEditMode ? `Memperbarui data perangkat milik NIP: ${nip}` : 'Masukkan data karyawan baru secara lengkap ke dalam database.'}
        </p>
      </div>

      {/* FORMULIR INPUT */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div>
          <label style={labelStyle}>Nomor Induk Pegawai (NIP)</label>
          <input 
            type="text" 
            name="nip" 
            value={formData.nip} 
            onChange={handleInputChange} 
            disabled={isEditMode} // NIP dikunci (tidak boleh diubah) saat mode Edit
            placeholder="Contoh: 9519449ZY" 
            style={{ ...inputStyle, backgroundColor: isEditMode ? '#f3f4f6' : '#fff', cursor: isEditMode ? 'not-allowed' : 'text' }} 
          />
        </div>

        <div>
          <label style={labelStyle}>Nama Lengkap Karyawan</label>
          <input 
            type="text" 
            name="nama_pengguna" 
            value={formData.nama_pengguna} 
            onChange={handleInputChange} 
            placeholder="Contoh: AHMAD FATHURROHMAN" 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={labelStyle}>Jabatan / Posisi</label>
          <input 
            type="text" 
            name="jabatan_pengguna" 
            value={formData.jabatan_pengguna} 
            onChange={handleInputChange} 
            placeholder="Contoh: TL JARGI (GI BAGENDANG)" 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={labelStyle}>Nomor WhatsApp / HP</label>
          <input 
            type="text" 
            name="no_hp" 
            value={formData.no_hp} 
            onChange={handleInputChange} 
            placeholder="Contoh: 085385375965" 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={labelStyle}>Kedudukan / Alamat Kantor Dinas</label>
          <textarea 
            name="kedudukan_pengguna" 
            value={formData.kedudukan_pengguna} 
            onChange={handleInputChange} 
            placeholder="Tulis alamat penempatan dinas secara lengkap..." 
            style={{ ...inputStyle, height: '65px', resize: 'vertical' }} 
          />
        </div>

        {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px dashed #e5e7eb', paddingTop: '14px', marginTop: '5px' }}>
          <div>
            <label style={labelStyle}>Nama Perangkat / Laptop</label>
            <input 
              type="text" 
              name="spesifikasi_perangkat" 
              value={formData.spesifikasi_perangkat} 
              onChange={handleInputChange} 
              placeholder="Contoh: MS Laptop HP ProBook" 
              style={inputStyle} 
            />
          </div>
          <div>
            <label style={labelStyle}>Serial Number (SN)</label>
            <input 
              type="text" 
              name="serial_number" 
              value={formData.serial_number} 
              onChange={handleInputChange} 
              placeholder="Contoh: 5CD4374R37" 
              style={inputStyle} 
            />
          </div>
        </div> */}

        {/* TOMBOL AKSI PANEL */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <button 
            type="button" 
            onClick={() => onNavigate('list')}
            style={{ padding: '9px 16px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#374151', fontWeight: '600' }}
          >
            <>
              <FiX />
              Batalkan
            </>
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '9px 16px',
              backgroundColor: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {loading ? (
              'Menyimpan...'
            ) : (
              <>
                <FiSave />
                Simpan Data Karyawan
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

// STYLING INTERN FORM
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '13.5px', color: '#1f2937', transition: 'border-color 0.2s' };