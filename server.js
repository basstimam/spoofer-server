const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username Anda
  password: '', // Ganti dengan password Anda
  database: 'spoofer_db' // Ganti dengan nama database Anda
});

// Tes koneksi ke database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Database terhubung...');
});

// Middleware untuk parsing body
app.use(bodyParser.json());

// Endpoint untuk memvalidasi kunci
app.post('/validate-key', (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ message: 'Kunci tidak ditemukan dalam permintaan.' });
  }
  
  // Query untuk mencari kunci di database
  db.query('SELECT * FROM `keys` WHERE `key` = ?', [key], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan saat mencari kunci.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Kunci tidak valid.' });
    }
    
    const keyData = results[0];
    const expDate = new Date(keyData.expdate);
    const currentDate = new Date();
    
    if (currentDate > expDate) {
      return res.status(403).json({ message: 'Kunci telah kadaluarsa.' });
    }
    
    // Jika kunci valid dan belum kadaluarsa
    res.status(200).json({ message: 'Kunci valid.', keyData });
  });
});



// Port server
const port = 3000;

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
