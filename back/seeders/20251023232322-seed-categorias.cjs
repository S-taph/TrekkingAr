'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('categorias', [
      {
        nombre: 'Trekking',
        descripcion: 'Caminatas y senderismo en montaña',
        activa: true,
        orden_visualizacion: 1,
        fecha_creacion: now
      },
      {
        nombre: 'Montañismo',
        descripcion: 'Escalada y ascensos de alta montaña',
        activa: true,
        orden_visualizacion: 2,
        fecha_creacion: now
      },
      {
        nombre: 'Aventura',
        descripcion: 'Actividades de aventura y deportes extremos',
        activa: true,
        orden_visualizacion: 3,
        fecha_creacion: now
      },
      {
        nombre: 'Expedición',
        descripcion: 'Expediciones de varios días en zonas remotas',
        activa: true,
        orden_visualizacion: 4,
        fecha_creacion: now
      },
      {
        nombre: 'Camping',
        descripcion: 'Campamentos y acampadas en la naturaleza',
        activa: true,
        orden_visualizacion: 5,
        fecha_creacion: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categorias', null, {});
  }
};
