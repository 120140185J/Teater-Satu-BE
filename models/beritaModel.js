const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Kategori = require('./kategoriModel');

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
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

Kategori.hasMany(Berita, { foreignKey: 'kategori_id' });
Berita.belongsTo(Kategori, { foreignKey: 'kategori_id' });

module.exports = Berita;
