const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../utils/database');

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false }
);

// Method untuk cek password
Model.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before create
const DEFAULT_SALT_ROUNDS = 10;
User.addHook('beforeCreate', async (user) => {
  user.password = await bcrypt.hash(user.password, DEFAULT_SALT_ROUNDS);
});

module.exports = User;
