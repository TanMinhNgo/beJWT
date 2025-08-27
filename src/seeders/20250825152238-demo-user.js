'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('User', [
      {
        email: 'john.doe@example.com',
        password: 'hashed_password',
        username: 'johndoe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'jane.doe@example.com',
        password: 'hashed_password',
        username: 'janedoe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'bob.smith@example.com',
        password: 'hashed_password',
        username: 'bobsmith',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
