'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sector extends Model {}

  Sector.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(62),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Sector',
    timestamps: true
  });

  Sector.associate = (models) => {
    Sector.hasMany(models.Company, { foreignKey: 'sector_id' });
  }

  return Sector;
};