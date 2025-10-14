'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mensajes_contacto', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      asunto: { type: Sequelize.STRING(255), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      estado: { type: Sequelize.ENUM('nuevo', 'respondido'), defaultValue: 'nuevo' },
      respuesta: { type: Sequelize.TEXT, allowNull: true },
      respondido_por: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mensajes_contacto')
  }
}
