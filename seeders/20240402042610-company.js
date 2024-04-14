'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Companies', [
      {
        id: uuidv4(),
        brand_name: 'Brand 1',
        company_name: 'Company 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        logo: 'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg',
        address: 'Jalan Mawar Melati, Jakarta Selatan, Jakarta',
        city: 'Jakarta Selatan',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(-6.255774727241181 106.8065370374879)'),
        sector_id: '8c41c737-8353-407c-9cb5-a8018582c7f7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        brand_name: 'Brand 2',
        company_name: 'Company 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        logo: 'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg',
        address: 'Jalan Apel Manggis, Bandung Barat, Jawa Barat',
        city: 'Bandung Barat',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(-6.890153319326862 107.39509157355332)'),
        sector_id: '32ce5378-41f0-4479-bc86-01d07635a580',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        brand_name: 'Brand 3',
        company_name: 'Company 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in mollis nisl, et laoreet arcu. Nam at lectus quis lectus tempor mattis. Sed semper fringilla turpis eu ornare. Pellentesque egestas faucibus feugiat. Nunc finibus est pulvinar diam tempor, quis efficitur metus placerat. Morbi malesuada, est eu fringilla ultrices, turpis risus posuere lorem, ac egestas mauris purus non erat. Fusce congue dui vel justo suscipit, et aliquet elit cursus. Nullam mattis massa malesuada placerat condimentum.',
        logo: 'https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg',
        address: 'Jalan Harimau, Kota Malang, Jawa Timur',
        city: 'Kota Malang',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(-7.957896673427737 112.62834419317218)'),
        sector_id: '50e2d8d0-bf29-4289-8bca-3b331a235f7f',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Companies', null, {});
  }
};