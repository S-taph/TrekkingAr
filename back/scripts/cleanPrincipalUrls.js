/**
 * Script para limpiar URLs incorrectas del campo imagen_principal_url
 *
 * Este script pone en NULL el campo imagen_principal_url de los viajes
 * que tienen imágenes en el array `imagenes`. El frontend automáticamente
 * usará la primera imagen del array.
 */

import { Viaje, ImagenViaje } from '../src/models/associations.js';
import { Op } from 'sequelize';

const cleanPrincipalUrls = async () => {
  console.log('🧹 Limpiando campo imagen_principal_url...\n');

  try {
    // Buscar viajes con imagen_principal_url definida
    const viajes = await Viaje.findAll({
      where: {
        imagen_principal_url: {
          [Op.ne]: null
        }
      },
      include: [{
        model: ImagenViaje,
        as: 'imagenes'
      }]
    });

    console.log(`Encontrados ${viajes.length} viajes con imagen_principal_url\n`);

    let actualizados = 0;

    for (const viaje of viajes) {
      const url = viaje.imagen_principal_url;

      // Verificar si el viaje tiene imágenes en el array
      if (viaje.imagenes && viaje.imagenes.length > 0) {
        console.log(`✓ Viaje ${viaje.id_viaje}: ${viaje.titulo}`);
        console.log(`  URL antigua: ${url}`);
        console.log(`  Usará: ${viaje.imagenes[0].url}`);

        // Limpiar el campo
        await viaje.update({ imagen_principal_url: null });
        actualizados++;
      } else {
        console.log(`⚠ Viaje ${viaje.id_viaje}: No tiene imágenes en el array`);
      }
    }

    console.log(`\n✅ Limpieza completada:`);
    console.log(`  - Campos limpiados: ${actualizados}/${viajes.length}`);
    console.log(`  - El frontend ahora usará automáticamente la primera imagen del array`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
};

cleanPrincipalUrls();
