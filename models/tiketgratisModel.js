const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Tiketgratis = sequelize.define(
  'Tiketgratis',
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
    fotoTiket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlahtiket : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    linktiket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    
  },
  { timestamps: false }
);

module.exports = Tiketgratis;
