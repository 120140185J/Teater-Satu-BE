const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Profilanggota = sequelize.define(
  'Profilanggota',
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
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deskripsi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

module.exports = Profilanggota;
