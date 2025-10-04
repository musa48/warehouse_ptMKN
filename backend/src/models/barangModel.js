const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Barang', {
    barang_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_barang: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    stok: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    lokasi_rak: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    tableName: 'barang',
    freezeTableName: true
  });
};