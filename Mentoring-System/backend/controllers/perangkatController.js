import * as PerangkatModel from '../models/perangkatModel.js';

// Get All Perangkat
export const getPerangkat = async (req, res) => {
  try {
    const perangkat = await PerangkatModel.getAllPerangkat();
    res.status(200).json(perangkat);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data perangkat', error: error.message });
  }
};

// Create Perangkat
export const createPerangkat = async (req, res) => {
  try {
    const { nama_perangkat, serial_number } = req.body;
    if (!nama_perangkat || !serial_number) {
      return res.status(400).json({ message: 'Nama perangkat dan Serial Number wajib diisi!' });
    }
    await PerangkatModel.createPerangkat(req.body);
    res.status(201).json({ message: 'Perangkat baru berhasil ditambahkan' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Serial Number (SN) sudah terdaftar!' });
    }
    res.status(500).json({ message: 'Gagal menambahkan perangkat', error: error.message });
  }
};

// Update Perangkat
export const updatePerangkat = async (req, res) => {
  try {
    const { id } = req.params;
    await PerangkatModel.updatePerangkat(id, req.body);
    res.status(200).json({ message: 'Data perangkat berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data perangkat', error: error.message });
  }
};

// Delete Perangkat
export const deletePerangkat = async (req, res) => {
  try {
    const { id } = req.params;
    await PerangkatModel.deletePerangkat(id);
    res.status(200).json({ message: 'Perangkat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus perangkat', error: error.message });
  }
};