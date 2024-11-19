const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./userModel');

const Paymenthistory = sequelize.define(
  'payment_history',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: false,
    },
    transaction_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fraud_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Paymenthistory many to one User
Paymenthistory.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user',
});

module.exports = Paymenthistory;
