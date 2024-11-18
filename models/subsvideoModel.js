const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Subsvideo = sequelize.define(
  'subs_video',
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
    sutradara: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
//   {
//     timestamps: true, // Enable timestamps (createdAt and updatedAt)
//   }
);

module.exports = Subsvideo;