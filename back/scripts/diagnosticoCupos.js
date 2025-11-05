/**
 * Script de diagnóstico para investigar sobrecupos
 * Ejecutar con: node scripts/diagnosticoCupos.js
 */

import readline from 'readline';
import http from 'http';

const API_URL = 'http://localhost:3003/api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function makeRequest(path, method, headers, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3003,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(parsedData.message || `HTTP ${res.statusCode}`));
          } else {
            resolve(parsedData);
          }
        } catch (error) {
          reject(new Error('Error parsing response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function login(email, password) {
  try {
    const data = await makeRequest('/auth/login', 'POST', {}, { email, password });
    const token = data.token || data.data?.token;

    if (!token) {
      throw new Error('No se recibió token en la respuesta');
    }

    return token;
  } catch (error) {
    throw new Error(`Error de login: ${error.message}`);
  }
}

async function getDiagnostico(token, idFechaViaje) {
  try {
    const data = await makeRequest(`/reservas/diagnostico-cupos/${idFechaViaje}`, 'GET', {
      'Authorization': `Bearer ${token}`,
    });
    return data;
  } catch (error) {
    throw new Error(`Error obteniendo diagnóstico: ${error.message}`);
  }
}

async function main() {
  console.log('=== Diagnóstico de Cupos ===\n');

  try {
    const email = await question('Email de admin: ');
    const password = await question('Password: ');
    const idFechaViaje = await question('ID de fecha_viaje a diagnosticar (ej: 4): ');

    console.log('\n🔐 Iniciando sesión...');
    const token = await login(email, password);
    console.log('✅ Login exitoso\n');

    console.log(`🔍 Obteniendo diagnóstico para fecha_viaje ${idFechaViaje}...`);
    const resultado = await getDiagnostico(token, idFechaViaje);

    console.log('\n📊 DIAGNÓSTICO COMPLETO\n');
    console.log('='.repeat(60));

    const info = resultado.data;
    console.log(`\n📅 FECHA DE VIAJE #${info.id_fecha_viaje}`);
    console.log(`   Viaje: ${info.viaje_titulo}`);
    console.log(`   Fecha inicio: ${new Date(info.fecha_inicio).toLocaleDateString()}`);
    console.log(`   Fecha fin: ${new Date(info.fecha_fin).toLocaleDateString()}`);

    console.log(`\n📈 CUPOS`);
    console.log(`   Cupos totales: ${info.cupos_totales}`);
    console.log(`   Cupos ocupados (DB): ${info.cupos_ocupados}`);
    console.log(`   Cupos disponibles: ${info.cupos_disponibles}`);

    console.log(`\n🧮 CÁLCULO REAL`);
    console.log(`   Reservas no canceladas: ${info.total_reservas}`);
    console.log(`   Personas totales: ${info.total_personas}`);

    const diferencia = info.total_personas - info.cupos_totales;
    if (diferencia > 0) {
      console.log(`\n⚠️  SOBRECUPO DETECTADO: +${diferencia} personas`);
    } else if (diferencia < 0) {
      console.log(`\n✅ Hay ${Math.abs(diferencia)} cupos libres`);
    } else {
      console.log(`\n✅ Cupos exactos (sin sobrecupo ni disponibilidad)`);
    }

    if (info.reservas && info.reservas.length > 0) {
      console.log(`\n📋 DETALLE DE RESERVAS NO CANCELADAS (${info.reservas.length})`);
      console.log('='.repeat(60));

      let acumulado = 0;
      info.reservas.forEach((reserva, index) => {
        acumulado += reserva.cantidad_personas;
        const fecha = new Date(reserva.fecha_reserva).toLocaleDateString();
        const sobrepasa = acumulado > info.cupos_totales;
        const marker = sobrepasa ? ' ⚠️  SOBRECUPO' : '';

        console.log(`\n   ${index + 1}. Reserva #${reserva.id_reserva}${marker}`);
        console.log(`      Cliente: ${reserva.cliente_email}`);
        console.log(`      Personas: ${reserva.cantidad_personas}`);
        console.log(`      Estado: ${reserva.estado_reserva}`);
        console.log(`      Fecha: ${fecha}`);
        console.log(`      Acumulado: ${acumulado}/${info.cupos_totales}`);
      });
    }

    if (info.total_personas !== info.cupos_ocupados) {
      console.log(`\n⚠️  INCONSISTENCIA DETECTADA`);
      console.log(`   cupos_ocupados en DB: ${info.cupos_ocupados}`);
      console.log(`   Personas reales: ${info.total_personas}`);
      console.log(`   Diferencia: ${info.total_personas - info.cupos_ocupados}`);
      console.log(`\n💡 Ejecuta el script syncCupos.js para corregir esta inconsistencia`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
