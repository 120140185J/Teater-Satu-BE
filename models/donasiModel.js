const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Berita = sequelize.define(
  'BeritaKolaborasi',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paragraf1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paragraf2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paragraf3: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Berita;