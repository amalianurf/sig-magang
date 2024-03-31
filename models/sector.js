'use strict';
const { Model } = require('sequelize');
const CompanyModel = require('../models').Company;

module.exports = (sequelize, DataTypes) => {
  class Sector extends Model {}

  Sector.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Sector',
    timestamps: true
  });

  Sector.hasMany(CompanyModel, { foreignKey: 'sector_id' });

  return Sector;
};