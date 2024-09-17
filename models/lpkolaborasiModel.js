const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const lpkolaborasi = sequelize.define(
  'Lpkolaborasi',
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
    deskripsi: {
      type: DataTypes.TEXT,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

module.exports = lpkolaborasi;
