const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./userModel');

const Paymenthistory = sequelize.define(
  'payment_histories',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gross_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    transaction_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fraud_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'payment_histories',
    timestamps: true,
  }
);

Paymenthistory.belongsTo(User, {
  foreignKey: 'id_user',
  targetKey: 'id',
  as: 'user',
});

module.exports = Paymenthistory;
