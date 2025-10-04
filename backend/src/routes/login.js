const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pengguna } = require('../models');
require('dotenv').config();

// Register Function
router.post('/register', async (req, res) => {
  try {
    const { nama_pengguna, username, pass_user, role_user } = req.body;
    if (!username || !pass_user || !role_user) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }
    const existingUser  = await Pengguna.findOne({ where: { username } });
    if (existingUser ) {
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }
    const user = await Pengguna.create({ nama_pengguna, username, pass_user, role_user });
    res.status(201).json({ message: 'Akun pengguna berhasil dibuat', user_id: user.user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Function
router.post("/", async (req, res) => {
  try {
    const { username, pass_user } = req.body;
    if (!username || !pass_user) {
      return res.status(400).json({ error: "Username dan password harus diisi" });
    }

    const user = await Pengguna.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    const validPassword = await user.validatePassword(pass_user);
    if (!validPassword) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Buat token JWT
    const JWTtoken = jwt.sign(
      { user_id: user.user_id, nama_pengguna: user.nama_pengguna, username: user.username, role: user.role_user },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      JWTtoken,
      user: {
        user_id: user.user_id,
        nama_pengguna: user.nama_pengguna,
        username: user.username,
        role: user.role_user,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;