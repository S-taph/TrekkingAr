'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('usuarios', 'password_hash', { type: Sequelize.STRING(255), allowNull: true })
    await queryInterface.addColumn('usuarios', 'googleId', { type: Sequelize.STRING(255), allowNull: true, unique: true })
    await queryInterface.addColumn('usuarios', 'avatar', { type: Sequelize.STRING(500), allowNull: true })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'avatar')
    await queryInterface.removeColumn('usuarios', 'googleId')
    await queryInterface.changeColumn('usuarios', 'password_hash', { type: Sequelize.STRING(255), allowNull: false })
  }
}
