import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Meload konfigurasi dari file .env
dotenv.config();

// Membuat connection pool ke database MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'migo_bap_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tes koneksi saat server pertama kali berjalan
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database MySQL (migo_bap_db).');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terhubung ke database MySQL:', error.message);
  }
})();

export default pool;