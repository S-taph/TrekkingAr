/**
 * Script para eliminar todas las reservas y resetear cupos
 * ⚠️ CUIDADO: Esta operación es IRREVERSIBLE
 * Ejecutar con: node scripts/resetReservas.js
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

async function resetReservas(token) {
  try {
    const data = await makeRequest('/reservas/reset-all', 'POST', {
      'Authorization': `Bearer ${token}`,
    });
    return data;
  } catch (error) {
    throw new Error(`Error reseteando reservas: ${error.message}`);
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║           ⚠️  ELIMINAR TODAS LAS RESERVAS  ⚠️              ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n🚨 ADVERTENCIA: Esta operación es IRREVERSIBLE\n');
  console.log('Se eliminarán:');
  console.log('  ❌ Todos los pagos');
  console.log('  ❌ Todas las reservas');
  console.log('  ❌ Todas las compras');
  console.log('  ❌ Todos los items en carritos');
  console.log('  ❌ Todos los carritos');
  console.log('  🔄 Los cupos_ocupados se resetearán a 0\n');

  try {
    const confirmacion1 = await question('¿Estás seguro de que quieres continuar? (escribe "SI" para confirmar): ');

    if (confirmacion1.toUpperCase() !== 'SI') {
      console.log('\n✅ Operación cancelada. No se eliminó nada.');
      rl.close();
      return;
    }

    const confirmacion2 = await question('\n⚠️  Última confirmación. Escribe "ELIMINAR TODO" para proceder: ');

    if (confirmacion2 !== 'ELIMINAR TODO') {
      console.log('\n✅ Operación cancelada. No se eliminó nada.');
      rl.close();
      return;
    }

    const email = await question('\nEmail de admin: ');
    const password = await question('Password: ');

    console.log('\n🔐 Iniciando sesión...');
    const token = await login(email, password);
    console.log('✅ Login exitoso\n');

    console.log('🗑️  Eliminando todas las reservas...');
    const result = await resetReservas(token);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ LIMPIEZA COMPLETADA                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 Resultados:');
    console.log(`   ❌ Pagos eliminados: ${result.data.pagos_eliminados}`);
    console.log(`   ❌ Reservas eliminadas: ${result.data.reservas_eliminadas}`);
    console.log(`   ❌ Compras eliminadas: ${result.data.compras_eliminadas}`);
    console.log(`   ❌ Items de carrito eliminados: ${result.data.items_carrito_eliminados}`);
    console.log(`   ❌ Carritos eliminados: ${result.data.carritos_eliminados}`);
    console.log(`   🔄 Fechas reseteadas: ${result.data.fechas_reseteadas}\n`);

    console.log('✨ El sistema ahora está limpio y listo para recibir nuevas reservas');
    console.log('   con las validaciones correctas implementadas.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
