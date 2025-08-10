const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../utils/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_time: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_reset_expires: {
      type: 'TIMESTAMP',
      allowNull: true,
    },
  },
  {
    // ✅ BLOK HOOKS UNTUK PASSWORD SUDAH DIHAPUS DARI SINI
    timestamps: false,
  }
);


// Method untuk mencocokkan password tetap diperlukan untuk proses login
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;