const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./userModel');
const Tiket = require('./tiketModel');

const HistoryBuyTiket = sequelize.define(
  'history_buy_tikets',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_tiket: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    jumlah_tiket: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

HistoryBuyTiket.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user',
});

HistoryBuyTiket.belongsTo(Tiket, {
  foreignKey: 'id_tiket',
  as: 'tiket',
});

module.exports = HistoryBuyTiket;
