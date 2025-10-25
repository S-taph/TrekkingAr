/**
 * Seeder: Reviews de ejemplo
 *
 * Crea 8 reviews de ejemplo con diferentes ratings y comentarios
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reviews', [
      {
        nombre: 'María González',
        ubicacion: 'Córdoba, Argentina',
        comentario: 'Una experiencia increíble en el Cerro Champaquí. Los guías fueron excepcionales, muy profesionales y atentos. El paisaje es simplemente espectacular. ¡Totalmente recomendado!',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Juan Pablo Martínez',
        ubicacion: 'Buenos Aires, Argentina',
        comentario: 'Excelente organización y atención al detalle. La caminata fue desafiante pero gratificante. Los guías conocen muy bien la zona y hacen que la experiencia sea segura y divertida.',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Laura Fernández',
        ubicacion: 'Rosario, Argentina',
        comentario: 'Una aventura inolvidable en las sierras. Todo estuvo perfectamente coordinado, desde el transporte hasta el equipamiento. Los paisajes son de otro mundo.',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Carlos Rodríguez',
        ubicacion: 'Mendoza, Argentina',
        comentario: 'Muy buena experiencia en general. El trekking fue más exigente de lo esperado, pero el equipo nos apoyó en todo momento. Las vistas valieron totalmente la pena.',
        rating: 4,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Ana Silvina Torres',
        ubicacion: 'San Luis, Argentina',
        comentario: 'Recomiendo 100% esta experiencia. Los guías son súper conocedores de la zona, te hacen sentir seguro en todo momento. La comida en el camino estuvo excelente.',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Diego Peralta',
        ubicacion: 'La Plata, Argentina',
        comentario: 'Una aventura que superó mis expectativas. El nivel de profesionalismo y la pasión por la naturaleza del equipo es contagioso. Ya estoy planeando mi próximo viaje con ellos.',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Sofía Ramírez',
        ubicacion: 'Neuquén, Argentina',
        comentario: 'Excelente atención y cuidado del medio ambiente. Se nota que aman lo que hacen. La conexión con la naturaleza que logras en estos viajes no tiene precio.',
        rating: 5,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
      {
        nombre: 'Martín López',
        ubicacion: 'Tucumán, Argentina',
        comentario: 'Muy buena experiencia, aunque me hubiera gustado más información previa sobre el nivel de dificultad. De todas formas, el equipo estuvo siempre disponible y atento.',
        rating: 4,
        id_viaje: null,
        activo: true,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  },
};
