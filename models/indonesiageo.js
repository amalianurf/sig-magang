'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class IndonesiaGeo extends Model {}

  IndonesiaGeo.init({
    id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false
    },
    city: DataTypes.STRING(50),
    geom: DataTypes.GEOMETRY('MULTIPOLYGON')
  }, {
    sequelize,
    modelName: 'IndonesiaGeo',
    timestamps: false
  });

  IndonesiaGeo.associate = (models) => {
    IndonesiaGeo.hasMany(models.Company, { foreignKey: 'geo_id' });
  }

  return IndonesiaGeo;
};