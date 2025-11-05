import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('Conectando a la base de datos...');

    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, 'add_email_verification_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Ejecutando migración...');
    await connection.query(migrationSQL);

    console.log('✅ Migración ejecutada exitosamente!');
    console.log('Las columnas is_verified, verification_token y token_expiry han sido agregadas a la tabla usuarios.');

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);

    // Si el error es por columna duplicada, es porque ya existe
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Las columnas ya existen en la base de datos.');
    }
  } finally {
    await connection.end();
  }
}

runMigration();
