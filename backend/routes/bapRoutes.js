import express from 'express';

const router = express.Router();

// PERBAIKAN DI BARIS INI: Tambahkan huruf S pada nama variabelnya
const APPS_SCRIPT_URL = process.env.APP_SCRIPT_URL; 

// 1. ENDPOINT: OPER DATA DARI FRONTEND KE SPREADSHEET
router.post('/simpan', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal terhubung ke Google Sheets via Apps Script', error: error.message });
  }
});

router.get('/cari/:noAR', async (req, res) => {
  try {
    const noAR = req.params.noAR;
    
    // Tembak ke Google Apps Script
    const response = await fetch(`${APPS_SCRIPT_URL}?action=cari&noAR=${noAR}`);
    const data = await response.json(); // Ambil JSON dari Google Script
    
    // KUNCI: Langsung kembalikan semua data ke React tanpa diubah/difilter!
    return res.status(200).json(data); 

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal terhubung ke database.', error: error.message });
  }
});

// ENDPOINT BARU: UNTUK UPDATE STATUS DAN LINK GDRIVE
router.post('/update-bap', async (req, res) => {
  try {
    const { rowNumber, status, urlDrive } = req.body;

    // Kirim data ke Google Apps Script dengan flag action: \"update\"
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        rowNumber: rowNumber,
        status: status,
        urlDrive: urlDrive
      })
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal terhubung ke Google Script.', error: error.message });
  }
});

// ENDPOINT UNTUK MENGAMBIL DATA MONITORING & STATISTIK
router.get('/monitoring-stats', async (req, res) => {
  try {
    // Memanggil Google Apps Script dengan parameter action=monitoring
    const response = await fetch(`${APPS_SCRIPT_URL}?action=monitoring`);
    const data = await response.json();
    
    if (data.success) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ success: false, message: 'Gagal memuat statistik.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error server backend.', error: error.message });
  }
});

export default router;