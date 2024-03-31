'use strict';
const { Model } = require('sequelize');
const CompanyModel = require('../models').Company;

module.exports = (sequelize, DataTypes) => {
  class Opportunity extends Model {}

  Opportunity.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    activity_type: {
      type: DataTypes.ENUM,
      values: ['WFO', 'WFH', 'Hybrid']
    },
    duration: {
      type: DataTypes.NUMBER(2),
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    quota: {
      type: DataTypes.NUMBER(2)
    },
    start_period: {
      type: DataTypes.DATE,
      allowNull: false
    },
    min_semester: {
      type: DataTypes.NUMBER(1),
      defaultValue: 0,
    },
    salary: {
      type: DataTypes.NUMBER(8),
    },
    company_id: {
      type: DataTypes.STRING(36),
      references: {
        model: 'Company',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Opportunity',
    timestamps: true
  });

  Opportunity.belongsTo(CompanyModel, { foreignKey: 'company_id' });

  return Opportunity;
};