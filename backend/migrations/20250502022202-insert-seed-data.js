'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Hong Gipyo',
        email: 'honggipyo@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Gipyo Hong',
        email: 'gipyo@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Gipyo',
        email: 'hgoeshard@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        name: 'ワイヤレスマウス',
        price: 2500,
        description: '使いやすいワイヤレスマウス',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'メカニカルキーボード',
        price: 8500,
        description: '高品質な打鍵感を実現',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'ワイヤレスマウス',
        price: 2500,
        description: '使いやすいワイヤレスマウス',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('Purchases', [
      {
        userId: 1,
        productId: 1,
        quantity: 2,
        totalPrice: 5000,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        productId: 2,
        quantity: 1,
        totalPrice: 8500,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        productId: 3,
        quantity: 1,
        totalPrice: 2500,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Purchases', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
