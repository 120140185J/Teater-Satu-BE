const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Profilanggota = sequelize.define('profilanggota', {
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
    allowNull: false,
  },
  jabatan: {
    //JABATAN ITU USERNAME INSTAGRAM
    type: DataTypes.STRING,
    allowNull: true,
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coach: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  porto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkig: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Profilanggota;
