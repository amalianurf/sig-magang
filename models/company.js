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
      type: DataTypes.STRING(50),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(50)
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
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    sector_id: {
      type: DataTypes.STRING(36),
      references: {
        model: 'Sector',
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
    Company.hasMany(models.Opportunity, { foreignKey: 'company_id' });
  }

  return Company;
};