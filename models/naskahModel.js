const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Naskah = sequelize.define(
  'Naskah',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    namaNaskah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fotoThumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengarang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isiNaskah: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
    
  },
  { timestamps: false }
);

module.exports = Naskah;
