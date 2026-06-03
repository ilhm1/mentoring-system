import express from 'express';
import { 
  getPerangkat, 
  createPerangkat, 
  updatePerangkat, 
  deletePerangkat 
} from '../controllers/perangkatController.js';

const router = express.Router();

// Jalur API Perangkat
router.get('/', getPerangkat);          // GET /api/perangkat (Ambil Semua)
router.post('/', createPerangkat);      // POST /api/perangkat (Tambah)
router.put('/:id', updatePerangkat);    // PUT /api/perangkat/:id (Edit)
router.delete('/:id', deletePerangkat); // DELETE /api/perangkat/:id (Hapus)

export default router;