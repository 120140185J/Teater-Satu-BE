const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Subsvideo = sequelize.define(
  'Subsvideo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    judulpertunjukan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sutradara: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
//   {
//     timestamps: true, // Enable timestamps (createdAt and updatedAt)
//   }
);

module.exports = Subsvideo;