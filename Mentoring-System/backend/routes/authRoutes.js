import express from 'express';
import jwt from 'jsonwebtoken'; // Import jwt untuk membaca token microsoft
import jwksClient from 'jwks-rsa'; // Import jwks untuk mengambil public key microsoft

const router = express.Router();
// const googleClient = new OAuth2Client("PASANG_CLIENT_ID_GOOGLE_ANDA_DISINI");

// Set up Key Client untuk Microsoft Keys Discovery
const msClient = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys'
});

function getKey(header, callback){
  msClient.getSigningKey(header.kid, function(err, key) {
    const signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}


// 2. ENDPOINT MICROSOFT / OUTLOOK AUTH BARU
router.post('/microsoft', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token Outlook tidak ditemukan.' });
  }

  // Verifikasi Token JWT dari Microsoft secara Asinkron
  jwt.verify(token, getKey, {
    audience: "c837f8a4-213d-4175-b3e0-0336c3c9ffdf", // Ganti dengan Client ID Azure Anda
    issuer: [
      "https://login.microsoftonline.com/common/v2.0",
      `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0` // Format issuer akun personal Outlook
    ]
  }, (err, decoded) => {
    if (err) {
      console.error("🔥 Error Microsoft Auth:", err.message);
      return res.status(401).json({ success: false, message: 'Token Outlook tidak valid.', error: err.message });
    }

    // Ekstrak data user Microsoft yang sukses terverifikasi
    const userData = {
      email: decoded.email || decoded.preferred_username,
      name: decoded.name,
      picture: null // Token dasar Outlook personal biasanya tidak menyertakan foto biner secara langsung
    };

    return res.status(200).json({
      success: true,
      message: 'Otentikasi Outlook Berhasil!',
      user: userData
    });
  });
});

export default router;