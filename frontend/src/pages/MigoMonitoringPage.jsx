import React, { useState, useEffect } from 'react';
import BASE_URL from '../utils/api';

export default function MigoMonitoringPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- STATE UNTUK PAGINASI DASHBOARD UTAMA ---
  const ROWS_PER_PAGE = 10;
  const [brandPage, setBrandPage] = useState(1);
  const [areaPage, setAreaPage] = useState(1);
  const [subAreaPage, setSubAreaPage] = useState(1);

  // --- STATE UNTUK POP-UP MODAL & FITUR DI DALAMNYA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [selectedNames, setSelectedNames] = useState([]);
  
  // Fitur Dalam Modal
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const MODAL_ROWS_PER_PAGE = 10;

  useEffect(() => {
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/api/bap/monitoring-stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
        setBrandPage(1);
        setAreaPage(1);
        setSubAreaPage(1);
      } else {
        setError('Gagal memproses data dari spreadsheet.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI KONTROL MODAL GENERIK (Untuk Semua Tabel) ---
  const handleOpenModal = (title, subtitle, dataValue) => {
    setModalTitle(title);
    setModalSubtitle(subtitle);
    
    if (Array.isArray(dataValue)) {
      setSelectedNames(dataValue);
    } else if (dataValue && dataValue.names) {
      setSelectedNames(dataValue.names);
    } else {
      setSelectedNames([]); 
    }
    
    setModalSearchQuery('');
    setModalCurrentPage(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalSubtitle('');
    setSelectedNames([]);
    setModalSearchQuery('');
    setModalCurrentPage(1);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h3>🔄 Memuat Data Dashboard Monitoring...</h3>
        <p>Sistem sedang menghitung seluruh data langsung dari Google Sheet.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#e74c3c' }}>
        <h3>❌ Terjadi Kesalahan</h3>
        <p>{error}</p>
        <button onClick={fetchStatsData} style={{ padding: '10px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Coba Lagi</button>
      </div>
    );
  }

  const getUniqueCount = (obj) => Object.keys(obj || {}).length;

  const getPaginatedData = (dataObj, currentPage) => {
    const entries = Object.entries(dataObj || {});
    const totalPages = Math.ceil(entries.length / ROWS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedEntries = entries.slice(startIndex, startIndex + ROWS_PER_PAGE);
    
    return { paginatedEntries, totalPages };
  };

  const brandData = getPaginatedData(stats?.brands, brandPage);
  const areaData = getPaginatedData(stats?.personalAreas, areaPage);
  const subAreaData = getPaginatedData(stats?.personalSubAreas, subAreaPage);

  // --- LOGIKA FILTER & PAGINASI DI DALAM MODAL ---
  const filteredModalNames = selectedNames.filter(name => 
    name.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  const totalModalPages = Math.ceil(filteredModalNames.length / MODAL_ROWS_PER_PAGE) || 1;
  const modalStartIndex = (modalCurrentPage - 1) * MODAL_ROWS_PER_PAGE;
  const paginatedModalNames = filteredModalNames.slice(modalStartIndex, modalStartIndex + MODAL_ROWS_PER_PAGE);

  const PaginationControls = ({ currentPage, totalPages, setPage }) => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 0', borderTop: '1px solid #edf2f7' }}>
        <button 
          onClick={() => setPage((p) => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
          style={paginationBtnStyle(currentPage === 1)}
        >
          ⬅️ Prev
        </button>
        <span style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>
          Halaman {currentPage} dari {totalPages}
        </span>
        <button 
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
          disabled={currentPage === totalPages}
          style={paginationBtnStyle(currentPage === totalPages)}
        >
          Next ➡️
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid #34495e', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}> Real-time Monitoring Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>Data agregat otomatis yang disinkronkan langsung dari Google Spreadsheet Utama.</p>
        </div>
        <button onClick={fetchStatsData} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔄 Segarkan Data
        </button>
      </div>

      {/* 4 KARTU UTAMA MONITORING */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '4px' }}>
        <div style={cardStyle('#3498db')}>
          <div style={{ fontSize: '32px' }}></div>
          <div>
            <div style={cardCountStyle}>{stats?.totalPIC || 0}</div>
            <div style={cardLabelStyle}>Total CALON PENGGUNA / PIC</div>
          </div>
        </div>
        <div style={cardStyle('#e67e22')}>
          <div style={{ fontSize: '32px' }}></div>
          <div>
            <div style={cardCountStyle}>{getUniqueCount(stats?.brands)}</div>
            <div style={cardLabelStyle}>Variasi BRAND Perangkat</div>
          </div>
        </div>
        <div style={cardStyle('#9b59b6')}>
          <div style={{ fontSize: '32px' }}></div>
          <div>
            <div style={cardCountStyle}>{getUniqueCount(stats?.personalAreas)}</div>
            <div style={cardLabelStyle}>PERSONAL AREA NAME</div>
          </div>
        </div>
        <div style={cardStyle('#1abc9c')}>
          <div style={{ fontSize: '32px' }}></div>
          <div>
            <div style={cardCountStyle}>{getUniqueCount(stats?.personalSubAreas)}</div>
            <div style={cardLabelStyle}>PERSONAL SUB AREA NAME</div>
          </div>
        </div>
      </div>

      <br/><hr/><br/>

      <h3 style={{ color: '#34495e', marginBottom: '15px' }}> Rincian Distribusi & Sebaran Data</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        {/* SUB-TABEL 1: SEBARAN BRAND */}
        <div style={tableContainerStyle}>
          <h4 style={tableTitleStyle}> Distribusi Berdasarkan BRAND</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={thStyle}>Nama Brand / Merk</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Jumlah Unit</th>
              </tr>
            </thead>
            <tbody>
              {brandData.paginatedEntries.map(([key, val]) => {
                const count = Array.isArray(val) ? val.length : (val.count || val);
                return (
                  <tr key={key} style={trStyle}>
                    <td 
                      style={clickableLinkStyle}
                      onClick={() => handleOpenModal("Daftar PIC (Berdasarkan Brand)", ` ${key}`, val)}
                      title="Klik untuk melihat daftar nama"
                    >
                      {key} <span style={detailBadgeStyle}>🔍</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold', color: '#e67e22' }}>{count} Perangkat</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls currentPage={brandPage} totalPages={brandData.totalPages} setPage={setBrandPage} />
        </div>

        {/* SUB-TABEL 2: SEBARAN PERSONAL AREA */}
        <div style={tableContainerStyle}>
          <h4 style={tableTitleStyle}> Distribusi PERSONAL AREA NAME</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={thStyle}>Personal Area</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Total Berkas</th>
              </tr>
            </thead>
            <tbody>
              {areaData.paginatedEntries.map(([key, val]) => {
                const count = Array.isArray(val) ? val.length : (val.count || val);
                return (
                  <tr key={key} style={trStyle}>
                    <td 
                      style={clickableLinkStyle}
                      onClick={() => handleOpenModal("Daftar PIC (Personal Area)", ` ${key}`, val)}
                      title="Klik untuk melihat daftar nama"
                    >
                      {key} <span style={detailBadgeStyle}>🔍</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold', color: '#9b59b6' }}>{count} Record</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls currentPage={areaPage} totalPages={areaData.totalPages} setPage={setAreaPage} />
        </div>
      </div>

      <div style={{ marginTop: '25px' }}>
        {/* SUB-TABEL 3: SEBARAN PERSONAL SUB AREA */}
        <div style={tableContainerStyle}>
          <h4 style={tableTitleStyle}> Distribusi PERSONAL SUB AREA NAME</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={thStyle}>Nama Sub Area / UPT / Unit Layanan</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Jumlah PIC Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {subAreaData.paginatedEntries.map(([key, val]) => {
                const count = Array.isArray(val) ? val.length : (val.count || val);
                return (
                  <tr key={key} style={trStyle}>
                    <td 
                      style={clickableLinkStyle}
                      onClick={() => handleOpenModal("Daftar PIC (Personal Sub Area)", ` ${key}`, val)}
                      title="Klik untuk melihat daftar nama"
                    >
                      {key} <span style={detailBadgeStyle}>🔍</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold', color: '#1abc9c' }}>{count} Orang</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls currentPage={subAreaPage} totalPages={subAreaData.totalPages} setPage={setSubAreaPage} />
        </div>
      </div>

      {/* POP-UP MODAL KOMPONEN (GENERIK) */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            
            <div style={modalHeaderStyle}>
              <div>
                <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>{modalTitle}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>{modalSubtitle}</p>
              </div>
              <button onClick={handleCloseModal} style={modalCloseBtnStyle}>✖</button>
            </div>

            {selectedNames.length > 0 && (
              <div style={{ padding: '15px 20px 5px 20px' }}>
                <input 
                  type="text"
                  placeholder="🔍 Cari nama PIC di sini..."
                  value={modalSearchQuery}
                  onChange={(e) => {
                    setModalSearchQuery(e.target.value);
                    setModalCurrentPage(1); 
                  }}
                  style={modalSearchInputStyle}
                />
              </div>
            )}

            <div style={modalBodyStyle}>
              {selectedNames.length > 0 ? (
                <>
                  {paginatedModalNames.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                          <th style={{ ...modalThStyle, width: '50px', textAlign: 'center' }}>No</th>
                          <th style={modalThStyle}>Nama Lengkap Pengguna / PIC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedModalNames.map((name, index) => (
                          <tr key={index} style={modalTrStyle(index)}>
                            <td style={{ ...modalTdStyle, textAlign: 'center', color: '#7f8c8d', fontWeight: 'bold' }}>
                              {modalStartIndex + index + 1}
                            </td>
                            <td style={{ ...modalTdStyle, fontWeight: '500', color: '#2c3e50' }}>
                              {name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#e74c3c', padding: '20px', fontSize: '14px' }}>
                       Nama "<strong>{modalSearchQuery}</strong>" tidak ditemukan pada kategori ini.
                    </div>
                  )}
                  
                  <PaginationControls 
                    currentPage={modalCurrentPage} 
                    totalPages={totalModalPages} 
                    setPage={setModalCurrentPage} 
                  />
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                  <p><i>Data daftar nama kosong.</i></p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// --- STYLING UTAMA DASHBOARD ---
const cardStyle = (borderColor) => ({
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  borderLeft: `6px solid ${borderColor}`,
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
});

const cardCountStyle = { fontSize: '26px', fontWeight: 'bold', color: '#2c3e50', lineHeight: '1.2' };
const cardLabelStyle = { fontSize: '11px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '3px' };

const tableContainerStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0'
};

const tableTitleStyle = { margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '2px solid #edf2f7', paddingBottom: '8px' };
const thStyle = { padding: '10px', fontSize: '13px', color: '#7f8c8d', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', fontSize: '14px', borderBottom: '1px solid #edf2f7', color: '#333' };
const trStyle = { transition: 'background 0.2s' };

// Styling untuk cell tabel yang bisa diklik
const clickableLinkStyle = {
  ...tdStyle,
  color: '#2980b9',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const detailBadgeStyle = {
  fontSize: '11px',
  backgroundColor: '#ebf5fb',
  color: '#2980b9',
  padding: '3px 8px',
  borderRadius: '12px',
  marginLeft: '5px'
};

const paginationBtnStyle = (disabled) => ({
  padding: '6px 12px',
  backgroundColor: disabled ? '#ecf0f1' : '#3498db',
  color: disabled ? '#bdc3c7' : '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 'bold',
  fontSize: '12px',
  transition: 'background-color 0.2s'
});

// --- STYLING KHUSUS POP-UP MODAL ---
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(44, 62, 80, 0.6)', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '550px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
  border: '1px solid #d6dbdf'
};

const modalHeaderStyle = {
  padding: '18px 20px',
  borderBottom: '1px solid #edf2f7',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fdfefe',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px'
};

const modalCloseBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#95a5a6',
  transition: 'color 0.2s'
};

const modalSearchInputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  transition: 'border-color 0.2s'
};

const modalBodyStyle = {
  padding: '10px 20px 20px 20px',
  overflow: 'hidden' 
};

const modalThStyle = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#7f8c8d',
  borderBottom: '2px solid #eaeded',
  fontWeight: 'bold'
};

const modalTdStyle = {
  padding: '11px 12px',
  fontSize: '14px',
  borderBottom: '1px solid #f2f4f4'
};

const modalTrStyle = (index) => ({
  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfc', 
  transition: 'background-color 0.1s'
});