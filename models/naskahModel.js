const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Naskah = sequelize.define(
  'naskahs',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    namaNaskah: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    fotoThumbnail: {
      type: DataTypes.STRING,
      allowNull: true, // Ubah jadi opsional
      validate: { isUrl: true },
    },
    fileUrl: {
      // Kolom baru untuk .pdf dan .docx
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    pengarang: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    isiNaskah: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    linknaskah: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, isUrl: true },
    },
  },
  {
    timestamps: true,
    tableName: 'naskahs',
  }
);

module.exports = Naskah;
