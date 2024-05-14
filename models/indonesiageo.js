'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class IndonesiaGeo extends Model {}

  IndonesiaGeo.init({
    gid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    shape_leng: DataTypes.NUMERIC,
    shape_area: DataTypes.NUMERIC,
    city: DataTypes.STRING(50),
    city_code: DataTypes.STRING(50),
    geom: DataTypes.GEOMETRY
  }, {
    sequelize,
    modelName: 'IndonesiaGeo',
    timestamps: false
  });

  return IndonesiaGeo;
};