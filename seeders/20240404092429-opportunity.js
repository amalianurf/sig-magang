'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Opportunities', [
      {
        id: uuidv4(),
        name: 'Opportunity 1',
        activity_type: 'WFH',
        duration: 3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        quota: 5,
        start_period: new Date('2024-04-10'),
        min_semester: 5,
        salary: 1000000,
        company_id: '33839e69-cf59-4e51-a6e1-0980058001d2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Opportunity 2',
        activity_type: 'Hybrid',
        duration: 3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        quota: 10,
        start_period: new Date('2024-04-10'),
        min_semester: 5,
        salary: 1200000,
        company_id: '33839e69-cf59-4e51-a6e1-0980058001d2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Opportunity 3',
        activity_type: 'WFO',
        duration: 2,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        quota: 2,
        start_period: new Date('2024-04-20'),
        min_semester: 5,
        salary: 500000,
        company_id: '40c7ca4f-e3b9-4b65-becf-5efee7dbb857',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Opportunities', null, {});
  }
};
