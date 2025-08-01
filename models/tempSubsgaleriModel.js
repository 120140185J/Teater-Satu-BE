const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Subsgaleri = require('./subsgaleriModel');

const TempSubsgaleri = sequelize.define(
  'temp_subs_galeris',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_subs_galeri: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Subsgaleri.hasMany(TempSubsgaleri, {
  foreignKey: 'id_subs_galeri',
  as: 'tempSubsgaleri',
  onDelete: 'CASCADE', // Tambahkan ON DELETE CASCADE
  onUpdate: 'CASCADE',
});

TempSubsgaleri.belongsTo(Subsgaleri, {
  foreignKey: 'id_subs_galeri',
  onDelete: 'CASCADE', // Pastikan konsistensi
  onUpdate: 'CASCADE',
});

module.exports = TempSubsgaleri;
