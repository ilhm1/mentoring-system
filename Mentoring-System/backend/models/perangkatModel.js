import pool from '../config/db.js'; // Pastikan path ke koneksi database Anda benar

// 1. Ambil semua data perangkat
export const getAllPerangkat = async () => {
  const [rows] = await pool.query('SELECT * FROM perangkat ORDER BY id DESC');
  return rows;
};

// 2. Tambah perangkat baru
export const createPerangkat = async (data) => {
  const { nama_perangkat, serial_number, status_perangkat } = data;
  const [result] = await pool.query(
    'INSERT INTO perangkat (nama_perangkat, serial_number, status_perangkat) VALUES (?, ?, ?)',
    [nama_perangkat, serial_number, status_perangkat || 'Tersedia']
  );
  return result;
};

// 3. Ubah data perangkat
export const updatePerangkat = async (id, data) => {
  const { nama_perangkat, serial_number, status_perangkat } = data;
  const [result] = await pool.query(
    'UPDATE perangkat SET nama_perangkat = ?, serial_number = ?, status_perangkat = ? WHERE id = ?',
    [nama_perangkat, serial_number, status_perangkat, id]
  );
  return result;
};

// 4. Hapus perangkat
export const deletePerangkat = async (id) => {
  const [result] = await pool.query('DELETE FROM perangkat WHERE id = ?', [id]);
  return result;
};