const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Galeri = sequelize.define(
  'Galeri',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    karya: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gambarGaleri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Galeri;
