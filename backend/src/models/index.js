const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const Barang = require('./barangModel')(sequelize);
const Transaksi = require('./transaksiModel')(sequelize);
const Pengguna = require('./penggunaModel')(sequelize);

Transaksi.belongsTo(Barang, { foreignKey: 'barang_id' });
Barang.hasMany(Transaksi, { foreignKey: 'barang_id' });
Transaksi.belongsTo(Pengguna, { foreignKey: 'user_id' });
Pengguna.hasMany(Transaksi, { foreignKey: 'user_id' });

module.exports = { sequelize, Barang, Transaksi, Pengguna };