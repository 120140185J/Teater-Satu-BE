const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Berita = sequelize.define(
  'Berita',
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
    gambar_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gambar_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description3: {
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
