const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const lptestimoni = sequelize.define(
  'Lptestimoni',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quote: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama: {
      type: DataTypes.TEXT,
    },
    jabatan: {
      type: DataTypes.TEXT,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = lptestimoni;
