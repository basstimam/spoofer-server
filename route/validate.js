// endpoints/validateKey.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', async (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ message: 'Kunci tidak ditemukan dalam permintaan.' });
  }

  try {
    // Mencari kunci di database menggunakan Prisma Client
    const keyData = await prisma.key.findUnique({
      where: {
        key: key
      }
    });

    if (!keyData) {
      return res.status(404).json({ message: 'Kunci tidak valid.' });
    }

    const expDate = new Date(keyData.expDate);
    const currentDate = new Date();

    if (currentDate > expDate) {
      return res.status(403).json({ message: 'Kunci telah kadaluarsa.' });
    }

    // Jika kunci valid dan belum kadaluarsa
    res.status(200).json({ message: 'Kunci valid.', keyData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mencari kunci.' + error.message });
  }
});

module.exports = router;
