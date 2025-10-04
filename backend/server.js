require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/login');
const dashboardRoutes = require('./src/routes/dashboard');
const barangRoutes = require('./src/routes/barang');
const transaksiRoutes = require('./src/routes/transaksi');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/transaksi', transaksiRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Database berhasil terhubung');
  })
  .catch(err => {
    console.error('Gagal menghubunhgkan ke database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});