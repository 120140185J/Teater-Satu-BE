const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Product = sequelize.define(
  'products',
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
    tersedia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deskripsi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    gambar_product: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Product;
