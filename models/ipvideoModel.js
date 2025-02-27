const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Ipvideo = sequelize.define(
  'Ipvideo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    video1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    video2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Ipvideo;