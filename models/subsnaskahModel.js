const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Subsnaskah = sequelize.define(
  'subs_naskah',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama_naskah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_naskah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengarang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kategori_naskah: {
      type: DataTypes.ENUM(['naskah', 'buku']),
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isi_naskah: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Subsnaskah;
