const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Kategori = sequelize.define(
  'Kategori',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Kategori;
