const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Galeri = sequelize.define(
  'galeri',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gambar_galeri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Galeri;
