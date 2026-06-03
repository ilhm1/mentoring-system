import pool from '../config/db.js';

// 1. Mengambil semua data pegawai (Untuk halaman list/tabel)
export const getAllPegawai = async () => {
  const [rows] = await pool.query('SELECT * FROM pegawai_perangkat ORDER BY created_at DESC');
  return rows;
};

// 2. Mengambil detail satu pegawai berdasarkan NIP
export const getPegawaiByNip = async (nip) => {
  const [rows] = await pool.query('SELECT * FROM pegawai_perangkat WHERE nip = ?', [nip]);
  return rows[0];
};

// 3. Mencari pegawai berdasarkan NIP ATAU Nama (Ini yang dipakai untuk fitur AUTO-FILL)
export const searchPegawai = async (keyword) => {
  const search = `%${keyword}%`;
  // LIMIT 1 memastikan kita hanya mengambil 1 data paling relevan untuk diisikan ke form
  const [rows] = await pool.query(
    'SELECT * FROM pegawai_perangkat WHERE nip LIKE ? OR nama_pengguna LIKE ? LIMIT 1',
    [search, search]
  );
  return rows[0]; 
};

// 4. Menambah data pegawai baru (Create)
export const createPegawai = async (data) => {
  const { nip, nama_pengguna, jabatan_pengguna, no_hp, kedudukan_pengguna } = data;
  
  // Perbaikan: Nama tabel diubah ke pegawai_perangkat & urutan array parameter disamakan dengan kueri SQL
  const [result] = await pool.query(
    `INSERT INTO pegawai_perangkat (nip, nama_pengguna, jabatan_pengguna, no_hp, kedudukan_pengguna) 
     VALUES (?, ?, ?, ?, ?)`,
    [nip, nama_pengguna, jabatan_pengguna, no_hp, kedudukan_pengguna]
  );
  return result;
};

// 5. Mengubah data pegawai (Update)
export const updatePegawai = async (nip, data) => {
  const { nama_pengguna, jabatan_pengguna, no_hp, kedudukan_pengguna } = data;
  
  // Perbaikan: Membuang tanda koma gantung yang menyebabkan syntax error di SQL dan array
  const [result] = await pool.query(
    `UPDATE pegawai_perangkat 
     SET nama_pengguna = ?, jabatan_pengguna = ?, no_hp = ?, kedudukan_pengguna = ?  
     WHERE nip = ?`,
    [nama_pengguna, jabatan_pengguna, no_hp, kedudukan_pengguna, nip]
  );
  return result;
};

// 6. Menghapus data pegawai (Delete)
export const deletePegawai = async (nip) => {
  const [result] = await pool.query('DELETE FROM pegawai_perangkat WHERE nip = ?', [nip]);
  return result;
};