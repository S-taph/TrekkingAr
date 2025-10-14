'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_notificaciones', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tipo: { type: Sequelize.ENUM('contact_form', 'sistema', 'order'), allowNull: false },
      leido: { type: Sequelize.BOOLEAN, defaultValue: false },
      meta: { type: Sequelize.JSON, allowNull: true },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      from_email: { type: Sequelize.STRING(255), allowNull: true },
      to_admin: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_notificaciones')
  }
}
