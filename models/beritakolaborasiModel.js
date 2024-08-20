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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Berita;
