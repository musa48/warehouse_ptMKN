const express = require('express');
const router = express.Router();
const { Barang, Transaksi, Pengguna } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middlewares/login');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const listTransaksi = await Transaksi.findAll({
      include: [
        {
            model: Barang,
            as: 'Barang',
            attributes: ['nama_barang'],
        },
        {
            model: Pengguna,
            as: 'Pengguna',
            attributes: ['nama_pengguna'],
        }
      ],
      attributes: [
          'tanggal_trans',
          'jenis_trans',
          'jumlah_barang',
          'keterangan'
      ],
      order: [
          ['tanggal_trans', 'DESC']
      ]
    });
    res.json(listTransaksi);

  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).json({ message: "Gagal mengambil data." });
  }
})

router.post('/', authMiddleware, roleMiddleware(['admin', 'staff']), async (req, res) => {
  try {
    const { tanggal_trans, barang_id, user_id, jenis_trans, jumlah_barang, keterangan } = req.body;
    const barang = await Barang.findByPk(barang_id);
    if (!barang) return res.status(404).json({ error: 'Data barang tidak ada' });
    if (jenis_trans === 'out' && barang.stok < jumlah_barang) {
      return res.status(400).json({ error: 'Stok barang tidak cukup' });
    }
    // Update stok barang
    const stokBaru = jenis_trans === 'in' ? barang.stok + jumlah_barang : barang.stok - jumlah_barang;
    await barang.update({ stok: stokBaru });
    // Simpan data transaksi
    const transaksi = await Transaksi.create({ tanggal_trans,barang_id,user_id,jenis_trans,jumlah_barang, keterangan });
    res.status(201).json(transaksi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;