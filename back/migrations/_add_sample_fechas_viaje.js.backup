import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addSampleFechas() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    console.log('🗓️  Agregando fechas de ejemplo para los viajes...\n');

    // Obtener viajes activos
    const [viajes] = await connection.query('SELECT id_viaje, titulo, precio_base FROM viajes WHERE activo = 1');

    if (viajes.length === 0) {
      console.log('❌ No hay viajes activos');
      return;
    }

    console.log(`Encontrados ${viajes.length} viajes activos\n`);

    // Para cada viaje, crear 3 fechas futuras
    for (const viaje of viajes) {
      console.log(`Agregando fechas para: ${viaje.titulo}`);

      // Fecha 1: En 2 semanas
      const fecha1Inicio = new Date();
      fecha1Inicio.setDate(fecha1Inicio.getDate() + 14);
      const fecha1Fin = new Date(fecha1Inicio);
      fecha1Fin.setDate(fecha1Fin.getDate() + 3); // 3 días después

      // Fecha 2: En 1 mes
      const fecha2Inicio = new Date();
      fecha2Inicio.setDate(fecha2Inicio.getDate() + 30);
      const fecha2Fin = new Date(fecha2Inicio);
      fecha2Fin.setDate(fecha2Fin.getDate() + 3);

      // Fecha 3: En 2 meses
      const fecha3Inicio = new Date();
      fecha3Inicio.setDate(fecha3Inicio.getDate() + 60);
      const fecha3Fin = new Date(fecha3Inicio);
      fecha3Fin.setDate(fecha3Fin.getDate() + 3);

      const fechas = [
        {
          inicio: fecha1Inicio.toISOString().slice(0, 19).replace('T', ' '),
          fin: fecha1Fin.toISOString().slice(0, 19).replace('T', ' '),
          precio: parseFloat(viaje.precio_base),
          cupos: 10
        },
        {
          inicio: fecha2Inicio.toISOString().slice(0, 19).replace('T', ' '),
          fin: fecha2Fin.toISOString().slice(0, 19).replace('T', ' '),
          precio: parseFloat(viaje.precio_base) * 1.1, // 10% más caro
          cupos: 8
        },
        {
          inicio: fecha3Inicio.toISOString().slice(0, 19).replace('T', ' '),
          fin: fecha3Fin.toISOString().slice(0, 19).replace('T', ' '),
          precio: parseFloat(viaje.precio_base) * 1.2, // 20% más caro
          cupos: 12
        }
      ];

      for (const fecha of fechas) {
        await connection.query(`
          INSERT INTO fechas_viaje
          (id_viaje, fecha_inicio, fecha_fin, cupos_disponibles, precio_fecha, estado_fecha, fecha_creacion, fecha_actualizacion)
          VALUES (?, ?, ?, ?, ?, 'disponible', NOW(), NOW())
        `, [viaje.id_viaje, fecha.inicio, fecha.fin, fecha.cupos, fecha.precio]);
      }

      console.log(`  ✅ 3 fechas agregadas`);
    }

    // Mostrar resumen
    const [totalFechas] = await connection.query('SELECT COUNT(*) as total FROM fechas_viaje');
    console.log(`\n✅ Total de fechas en la base de datos: ${totalFechas[0].total}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addSampleFechas();
