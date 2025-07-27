const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Program = sequelize.define(
  'programs',
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
    photo_thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_url_2: {
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

module.exports = Program;
