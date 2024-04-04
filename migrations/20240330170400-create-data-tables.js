'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION postgis;').then(() => (
      queryInterface.createTable('Sectors', {
        id: {
          type: Sequelize.STRING(36),
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
    }))).then(() => queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      brand_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      company_name: {
        type: Sequelize.STRING(50)
      },
      description: {
        type: Sequelize.TEXT
      },
      logo: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      sector_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'Sectors',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })).then(() => queryInterface.createTable('Opportunities', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      activity_type: {
        type: Sequelize.ENUM,
        values: ['WFO', 'WFH', 'Hybrid']
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      quota: {
        type: Sequelize.INTEGER
      },
      start_period: {
        type: Sequelize.DATE,
        allowNull: false
      },
      min_semester: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      salary: {
        type: Sequelize.INTEGER,
      },
      company_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'Companies',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Opportunities').then(() => (
      queryInterface.dropTable('Companies')
    )).then(() => (
      queryInterface.dropTable('Sectors')
    )).then(() => (
      queryInterface.sequelize.query('DROP EXTENSION postgis;')
    ));
  }
};