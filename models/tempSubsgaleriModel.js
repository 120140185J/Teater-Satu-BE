const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Subsgaleri = require('./subsgaleriModel');

const TempSubsgaleri = sequelize.define(
  'temp_subs_galeri',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_subs_galeri: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Subsgaleri.hasMany(TempSubsgaleri, {
  foreignKey: 'id_subs_galeri',
  as: 'tempSubsgaleri',
});

module.exports = TempSubsgaleri;
