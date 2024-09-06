const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Landingpageimage = sequelize.define('Landingpageimage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  photocaroselsatu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photocaroseldua: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photocaroseltiga: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Landingpageimage;
