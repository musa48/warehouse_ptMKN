const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Pengguna = sequelize.define(
    "Pengguna",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_pengguna: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      pass_user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "pengguna",
      freezeTableName: true,
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.pass_user = await bcrypt.hash(user.pass_user, salt);
        },
      },
    }
  );

  Pengguna.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.pass_user);
  };

  return Pengguna;
};