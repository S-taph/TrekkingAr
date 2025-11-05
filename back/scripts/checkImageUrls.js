/**
 * Script para verificar URLs de imágenes después de la migración
 */

import { ImagenViaje, Viaje } from '../src/models/associations.js';

const checkUrls = async () => {
  console.log('📸 Verificando URLs de imágenes en la base de datos...\n');

  try {
    // Obtener algunas imágenes de ejemplo
    const imagenes = await ImagenViaje.findAll({
      limit: 5,
      order: [['id_imagen_viaje', 'DESC']]
    });

    console.log('Últimas 5 imágenes registradas:');
    imagenes.forEach(img => {
      console.log(`\n  ID: ${img.id_imagen_viaje}`);
      console.log(`  Viaje ID: ${img.id_viaje}`);
      console.log(`  URL: ${img.url}`);
      console.log(`  Es URL absoluta: ${/^https?:\/\//.test(img.url) ? '❌ SÍ (problema!)' : '✅ NO (correcto)'}`);
    });

    // Verificar si quedan URLs absolutas
    const urlsAbsolutas = await ImagenViaje.count({
      where: {
        url: {
          [Op.like]: 'http%'
        }
      }
    });

    console.log(`\n\n📊 Estadísticas:`);
    console.log(`  Total imágenes: ${await ImagenViaje.count()}`);
    console.log(`  URLs absolutas restantes: ${urlsAbsolutas}`);
    console.log(`  Estado: ${urlsAbsolutas === 0 ? '✅ Migración exitosa' : '⚠️ Quedan URLs absolutas por migrar'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
};

// Importar Op de sequelize
import { Op } from 'sequelize';

checkUrls();
