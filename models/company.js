'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {}

  Company.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    brand_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(100)
    },
    description: {
      type: DataTypes.TEXT
    },
    logo: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.TEXT
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sector_id: {
      type: DataTypes.STRING(36),
      references: {
        model: 'Sector',
        key: 'id'
      }
    },
    geo_id: {
      type: DataTypes.STRING(6),
      references: {
        model: 'IndonesiaGeo',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Company',
    timestamps: true
  });

  Company.associate = (models) => {
    Company.belongsTo(models.Sector, { foreignKey: 'sector_id' });
    Company.belongsTo(models.IndonesiaGeo, { foreignKey: 'geo_id' });
    Company.hasMany(models.Opportunity, { foreignKey: 'company_id', onDelete: 'CASCADE' });
  }

  return Company;
};