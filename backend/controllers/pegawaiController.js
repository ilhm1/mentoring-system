import * as PegawaiModel from '../models/pegawaiModel.js';

// 1. Mengambil semua data pegawai
export const getPegawai = async (req, res) => {
  try {
    const pegawai = await PegawaiModel.getAllPegawai();
    res.status(200).json(pegawai);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
  }
};

// 2. Mengambil detail satu pegawai (atau pencarian auto-fill)
export const getPegawaiByNipOrSearch = async (req, res) => {
  try {
    // Kita cek apakah ada query '?search=' di URL
    const searchQuery = req.query.search;
    
    if (searchQuery) {
      // Jika ada query search, panggil fungsi pencarian (Untuk Auto-fill)
      const pegawai = await PegawaiModel.searchPegawai(searchQuery);
      if (!pegawai) {
        return res.status(404).json({ message: 'Data pegawai tidak ditemukan' });
      }
      return res.status(200).json(pegawai);
    } 

    // Jika tidak ada query search, ambil berdasarkan parameter URL (/:nip)
    const nip = req.params.nip;
    if (nip) {
      const pegawai = await PegawaiModel.getPegawaiByNip(nip);
      if (!pegawai) {
        return res.status(404).json({ message: 'Data pegawai tidak ditemukan' });
      }
      return res.status(200).json(pegawai);
    }

    res.status(400).json({ message: 'Parameter tidak valid' });

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
  }
};

// 3. Menambah data pegawai baru (Create)
export const createPegawai = async (req, res) => {
  try {
    await PegawaiModel.createPegawai(req.body);
    res.status(201).json({ message: 'Data pegawai berhasil ditambahkan' });
  } catch (error) {
    // Tangani error jika NIP sudah ada (Duplicate Entry)
    if (error.code === 'ER_DUP_ENTRY') {
      // UBAH TEKS DI BAWAH INI (Hapus kata Serial Number)
      return res.status(409).json({ message: 'NIP sudah terdaftar di database' });
    }
    res.status(500).json({ message: 'Gagal menambahkan data pegawai', error: error.message });
  }
};

// 4. Mengubah data pegawai (Update)
export const updatePegawai = async (req, res) => {
  try {
    const nip = req.params.nip;
    await PegawaiModel.updatePegawai(nip, req.body);
    res.status(200).json({ message: 'Data pegawai berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data pegawai', error: error.message });
  }
};

// 5. Menghapus data pegawai (Delete)
export const deletePegawai = async (req, res) => {
  try {
    const nip = req.params.nip;
    await PegawaiModel.deletePegawai(nip);
    res.status(200).json({ message: 'Data pegawai berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data pegawai', error: error.message });
  }
};