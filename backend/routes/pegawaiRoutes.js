import express from 'express';
import * as PegawaiController from '../controllers/pegawaiController.js';

const router = express.Router();

// Route untuk mengambil semua pegawai
router.get('/', PegawaiController.getPegawai);

// Route untuk mencari pegawai (auto-fill) ATAU mengambil detail by NIP
// Contoh URL: /api/pegawai/detail/9519449ZY ATAU /api/pegawai/detail?search=AHMAD
router.get('/detail/:nip?', PegawaiController.getPegawaiByNipOrSearch);

// Route untuk menambah pegawai baru (Create)
router.post('/', PegawaiController.createPegawai);

// Route untuk mengubah data pegawai (Update)
router.put('/:nip', PegawaiController.updatePegawai);

// Route untuk menghapus data pegawai (Delete)
router.delete('/:nip', PegawaiController.deletePegawai);

export default router;