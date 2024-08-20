const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Landingpageimage = sequelize.define('Landingpageimage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  photohero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photocta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phototiket: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Landingpageimage;
