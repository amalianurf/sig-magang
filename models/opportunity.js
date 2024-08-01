'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Opportunity extends Model {}

  Opportunity.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    activity_type: {
      type: DataTypes.ENUM,
      values: ['WFO', 'WFH', 'HYBRID']
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    quota: {
      type: DataTypes.INTEGER
    },
    start_period: {
      type: DataTypes.DATE,
      allowNull: false
    },
    min_semester: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salary: {
      type: DataTypes.INTEGER,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    company_id: {
      type: DataTypes.STRING(36),
      references: {
        model: 'Company',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Opportunity',
    timestamps: true
  });

  Opportunity.associate = (models) => {
    Opportunity.belongsTo(models.Company, { foreignKey: 'company_id' });
  }

  return Opportunity;
};