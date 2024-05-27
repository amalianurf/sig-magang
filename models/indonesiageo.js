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
    city: DataTypes.STRING(50),
    geom: DataTypes.GEOMETRY
  }, {
    sequelize,
    modelName: 'IndonesiaGeo',
    timestamps: false
  });

  return IndonesiaGeo;
};