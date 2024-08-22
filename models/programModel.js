const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Program = sequelize.define(
  'Program',
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
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Program;
