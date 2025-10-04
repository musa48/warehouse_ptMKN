const express = require('express');
const router = express.Router();
const { Barang } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middlewares/login');

// CRUD Barang
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { nama_barang, no_sku, stok, lokasi_rak } = req.body;
    const barang = await Barang.create({ nama_barang, no_sku, stok, lokasi_rak });
    res.status(201).json(barang);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  const listBarang = await Barang.findAll();
  res.json(listBarang);
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ error: 'Data barang tidak ada' });
    await barang.update(req.body);
    res.json(barang);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ error: 'Data barang tidak ada' });
    await barang.destroy();
    res.json({ message: 'Data barang berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;