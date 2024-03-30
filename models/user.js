'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(72),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
  });

  return User;
};