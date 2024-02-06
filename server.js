const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const validateKeyEndpoint = require('./route/validate.js');

const prisma = new PrismaClient();
const app = express();

// Middleware untuk parsing body
app.use(bodyParser.json());

// Endpoint untuk memvalidasi kunci
app.use('/validate-key', validateKeyEndpoint);

// Port server
const port = 3000;

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
