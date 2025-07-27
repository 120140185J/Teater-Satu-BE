const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Tiket = sequelize.define(
  'tikets',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama_pertujukan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal_pertujukan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tempat_pertujukan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    harga_tiket: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_mulai_penjualan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tanggal_selesai_penjualan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nama_kategori_tiket: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    harga_kategori_tiket: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jumlah_stok_tiket: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tampilkan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { timestamps: true }
);

module.exports = Tiket;
