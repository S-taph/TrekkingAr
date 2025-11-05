/**
 * Script de migración: Convertir URLs absolutas a rutas relativas
 *
 * Este script actualiza todas las URLs de imágenes en la base de datos
 * de URLs absolutas (con dominio) a rutas relativas.
 *
 * Ejemplos:
 * - De: https://ngrok-url.com/uploads/viajes/1/img-123.jpg
 * - A:  /uploads/viajes/1/img-123.jpg
 *
 * Uso: node scripts/migrateImageUrls.js
 */

import { ImagenViaje, Viaje } from '../src/models/associations.js';
import { Op } from 'sequelize';

const migrateImageUrls = async () => {
  console.log('🔄 Iniciando migración de URLs de imágenes...\n');

  try {
    // 1. Migrar imagenes_viaje table
    console.log('📸 Procesando tabla imagenes_viaje...');

    const imagenes = await ImagenViaje.findAll();
    let imagenesActualizadas = 0;

    for (const imagen of imagenes) {
      const urlOriginal = imagen.url;

      // Verificar si la URL es absoluta (contiene http:// o https://)
      if (/^https?:\/\//.test(urlOriginal)) {
        // Extraer solo la ruta relativa
        const urlObj = new URL(urlOriginal);
        const rutaRelativa = urlObj.pathname; // Ej: /uploads/viajes/1/img-123.jpg

        // Actualizar en la base de datos
        await imagen.update({ url: rutaRelativa });

        console.log(`  ✓ Imagen ${imagen.id_imagen_viaje}:`);
        console.log(`    Antes: ${urlOriginal}`);
        console.log(`    Después: ${rutaRelativa}`);

        imagenesActualizadas++;
      }
    }

    console.log(`\n  Total imágenes actualizadas: ${imagenesActualizadas}/${imagenes.length}`);

    // 2. Migrar viajes.imagen_principal_url
    console.log('\n📋 Procesando tabla viajes (imagen_principal_url)...');

    const viajes = await Viaje.findAll({
      where: {
        imagen_principal_url: {
          [Op.ne]: null
        }
      }
    });

    let viajesActualizados = 0;

    for (const viaje of viajes) {
      const urlOriginal = viaje.imagen_principal_url;

      // Verificar si la URL es absoluta
      if (/^https?:\/\//.test(urlOriginal)) {
        // Extraer solo la ruta relativa
        const urlObj = new URL(urlOriginal);
        const rutaRelativa = urlObj.pathname;

        // Actualizar en la base de datos
        await viaje.update({ imagen_principal_url: rutaRelativa });

        console.log(`  ✓ Viaje ${viaje.id_viaje} (${viaje.titulo}):`);
        console.log(`    Antes: ${urlOriginal}`);
        console.log(`    Después: ${rutaRelativa}`);

        viajesActualizados++;
      }
    }

    console.log(`\n  Total viajes actualizados: ${viajesActualizados}/${viajes.length}`);

    // 3. Resumen final
    console.log('\n✅ Migración completada exitosamente!');
    console.log(`\n📊 Resumen:`);
    console.log(`  - Imágenes migradas: ${imagenesActualizadas}`);
    console.log(`  - Viajes migrados: ${viajesActualizados}`);
    console.log(`  - Total actualizaciones: ${imagenesActualizadas + viajesActualizados}`);
    console.log('\n💡 Las nuevas imágenes que se suban ahora se guardarán automáticamente con rutas relativas.');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }

  process.exit(0);
};

// Ejecutar migración
migrateImageUrls();
