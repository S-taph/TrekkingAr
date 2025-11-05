/**
 * Script para verificar el campo imagen_principal_url
 */

import { Viaje } from '../src/models/associations.js';
import { Op } from 'sequelize';

const checkPrincipalUrls = async () => {
  console.log('🔍 Verificando campo imagen_principal_url...\n');

  try {
    const viajes = await Viaje.findAll({
      where: {
        imagen_principal_url: {
          [Op.ne]: null
        }
      },
      attributes: ['id_viaje', 'titulo', 'imagen_principal_url']
    });

    console.log(`Encontrados ${viajes.length} viajes con imagen_principal_url:\n`);

    viajes.forEach(viaje => {
      const url = viaje.imagen_principal_url;
      let tipo = '';

      if (/^https?:\/\//.test(url)) {
        tipo = '❌ URL absoluta';
      } else if (url.startsWith('/uploads/')) {
        tipo = '✅ Ruta relativa correcta';
      } else {
        tipo = '⚠️ Solo nombre de archivo (incorrecto)';
      }

      console.log(`ID: ${viaje.id_viaje}`);
      console.log(`Título: ${viaje.titulo}`);
      console.log(`URL: ${url}`);
      console.log(`Tipo: ${tipo}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
};

checkPrincipalUrls();
