import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../src/config/database.js';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ejecutarSeed() {
    console.log('🚀 Iniciando carga de viajes a la base de datos...\n');

    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida\n');

        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, 'seedViajes.sql');
        let sql = fs.readFileSync(sqlPath, 'utf8');

        // Remover comentarios multilínea y de línea
        sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
        sql = sql.replace(/--[^\n]*/g, '');

        // Dividir por puntos y coma, pero manteniendo los statements completos
        const statements = [];
        let currentStatement = '';
        let inString = false;
        let stringChar = null;

        for (let i = 0; i < sql.length; i++) {
            const char = sql[i];
            const prevChar = i > 0 ? sql[i - 1] : '';

            // Detectar inicio/fin de strings
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = null;
                }
            }

            // Si encontramos ; fuera de un string, es el final de un statement
            if (char === ';' && !inString) {
                const statement = currentStatement.trim();
                if (statement.length > 0 && statement.startsWith('INSERT')) {
                    statements.push(statement);
                }
                currentStatement = '';
            } else {
                currentStatement += char;
            }
        }

        console.log(`📝 Se encontraron ${statements.length} statements SQL\n`);

        let viajesCreados = 0;
        let fechasCreadas = 0;

        for (const statement of statements) {
            try {
                if (statement.includes('INSERT INTO viajes')) {
                    await sequelize.query(statement);
                    viajesCreados++;
                    console.log(`✅ Viaje ${viajesCreados} creado`);
                } else if (statement.includes('INSERT INTO fechas_viaje')) {
                    await sequelize.query(statement);
                    fechasCreadas++;
                }
            } catch (error) {
                console.error(`❌ Error al ejecutar statement:`, error.message);
                console.error('Statement:', statement.substring(0, 100) + '...');
            }
        }

        console.log('\n🎉 ¡SEED COMPLETADO CON ÉXITO!\n');
        console.log(`📍 Viajes creados: ${viajesCreados}`);
        console.log(`📅 Fechas creadas: ${fechasCreadas}\n`);

        console.log('📋 RESUMEN DE VIAJES:');
        const [viajes] = await sequelize.query(`
            SELECT
                v.id_viaje,
                v.titulo,
                c.nombre as categoria,
                v.dificultad,
                v.duracion_dias,
                v.precio_base,
                v.destino,
                COUNT(f.id_fechas_viaje) as total_fechas
            FROM viajes v
            LEFT JOIN categorias c ON v.id_categoria = c.id_categoria
            LEFT JOIN fechas_viaje f ON v.id_viaje = f.id_viaje
            WHERE v.id_viaje >= (SELECT MAX(id_viaje) - 9 FROM viajes)
            GROUP BY v.id_viaje, v.titulo, c.nombre, v.dificultad, v.duracion_dias, v.precio_base, v.destino
            ORDER BY v.id_viaje DESC
        `);

        console.table(viajes);

        console.log('\n⚠️  IMPORTANTE:');
        console.log('Ahora debes cargar las imágenes de los viajes.');
        console.log('Consulta el archivo LINKS_IMAGENES.md para los links de descarga.\n');
        console.log('Las rutas esperadas son:');
        viajes.forEach(v => {
            const fileName = v.titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                .replace(/ - /g, '-')
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, '');
            console.log(`  - /uploads/viajes/${fileName}.jpg`);
        });

        await sequelize.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ ERROR al ejecutar el seed:', error.message);
        console.error(error);
        await sequelize.close();
        process.exit(1);
    }
}

// Verificar que exista el archivo SQL
const sqlPath = path.join(__dirname, 'seedViajes.sql');
if (!fs.existsSync(sqlPath)) {
    console.error('❌ No se encontró el archivo seedViajes.sql');
    console.error('Ruta esperada:', sqlPath);
    process.exit(1);
}

ejecutarSeed();
