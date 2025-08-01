const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Galeri = sequelize.define(
  'galeris',
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
    gambarthumbnail: {
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
    gambarGaleri2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Galeri;
