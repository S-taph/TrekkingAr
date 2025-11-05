/**
 * Script para sincronizar cupos_ocupados
 * Ejecutar con: node scripts/syncCupos.js
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
    console.log('📦 Respuesta completa del login:', JSON.stringify(data, null, 2));

    // El token puede estar en data.token o data.data.token
    const token = data.token || data.data?.token;

    if (!token) {
      throw new Error('No se recibió token en la respuesta');
    }

    return token;
  } catch (error) {
    throw new Error(`Error de conexión: ${error.message}`);
  }
}

async function syncCupos(token) {
  try {
    console.log('📤 Enviando request con token:', token.substring(0, 20) + '...');
    const data = await makeRequest('/reservas/sync-cupos', 'POST', {
      'Authorization': `Bearer ${token}`,
    });
    return data;
  } catch (error) {
    console.log('❌ Error detallado:', error);
    throw new Error(`Error de conexión: ${error.message}`);
  }
}

async function main() {
  console.log('=== Sincronización de Cupos Ocupados ===\n');

  try {
    const email = await question('Email de admin: ');
    const password = await question('Password: ');

    console.log('\n🔐 Iniciando sesión...');
    const token = await login(email, password);
    console.log('✅ Login exitoso');
    console.log('🔑 Token recibido:', token.substring(0, 20) + '...\n');

    console.log('🔄 Sincronizando cupos...');
    const result = await syncCupos(token);

    console.log('\n✅ Sincronización completada!\n');
    console.log(`📊 Resultados:`);
    console.log(`   - Fechas procesadas: ${result.data.fechas_procesadas}`);
    console.log(`   - Fechas actualizadas: ${result.data.fechas_actualizadas}`);

    if (result.data.detalles.length > 0) {
      console.log('\n📋 Detalles de actualizaciones:');
      result.data.detalles.forEach(detalle => {
        console.log(`   - Fecha ${detalle.id_fecha_viaje}: ${detalle.cupos_anteriores} → ${detalle.cupos_nuevos} (${detalle.diferencia > 0 ? '+' : ''}${detalle.diferencia})`);
      });
    } else {
      console.log('\n✨ Todos los cupos ya estaban sincronizados');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
