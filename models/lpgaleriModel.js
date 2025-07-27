const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const lpgaleri = sequelize.define('lpgaleris', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  photogalerilsatu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photogaleridua: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photogaleritiga: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = lpgaleri;
