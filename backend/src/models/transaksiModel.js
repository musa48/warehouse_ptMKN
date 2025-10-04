const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Transaksi', {
    trans_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal_trans: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    barang_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jenis_trans: {
      type: DataTypes.ENUM('in', 'out'),
      allowNull: false,
    },
    jumlah_barang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'trans_barang',
    freezeTableName: true
  });
};