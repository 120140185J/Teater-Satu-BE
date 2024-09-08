const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const lpanggotautama = sequelize.define('Lpanggotautama', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  photoanggotasatu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photoanggotadua: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photoanggotatiga: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = lpanggotautama;
