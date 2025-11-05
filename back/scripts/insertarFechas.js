import sequelize from '../src/config/database.js';

// Primero obtenemos el mapeo de IDs (del título al id real)
const [viajes] = await sequelize.query(`
    SELECT id_viaje, titulo
    FROM viajes
    WHERE id_viaje >= (SELECT MAX(id_viaje) - 9 FROM viajes)
    ORDER BY titulo
`);

const viajeMap = {};
viajes.forEach(v => {
    viajeMap[v.titulo] = v.id_viaje;
});

console.log('📍 Mapeo de viajes:');
console.table(viajeMap);

// Ahora insertamos las fechas con los IDs correctos
const fechas = [
    // REFUGIO FREY
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2025-11-15', fecha_fin: '2025-11-15', cupos_totales: 12, cupos_ocupados: 3, precio_fecha: 45000, estado_fecha: 'disponible', observaciones: 'Temporada primavera - Flores de montaña' },
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2025-12-06', fecha_fin: '2025-12-06', cupos_totales: 12, cupos_ocupados: 8, precio_fecha: 45000, estado_fecha: 'disponible', observaciones: 'Verano - Nieve derretida' },
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2025-12-28', fecha_fin: '2025-12-28', cupos_totales: 12, cupos_ocupados: 12, precio_fecha: 48000, estado_fecha: 'completo', observaciones: 'Temporada alta - Fin de año' },
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2026-01-10', fecha_fin: '2026-01-10', cupos_totales: 12, cupos_ocupados: 2, precio_fecha: 48000, estado_fecha: 'disponible', observaciones: 'Temporada alta - Verano' },
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2026-02-14', fecha_fin: '2026-02-14', cupos_totales: 12, cupos_ocupados: 0, precio_fecha: 45000, estado_fecha: 'disponible', observaciones: 'San Valentín especial' },
    { viaje: 'Trekking al Refugio Frey', fecha_inicio: '2026-03-08', fecha_fin: '2026-03-08', cupos_totales: 12, cupos_ocupados: 5, precio_fecha: 45000, estado_fecha: 'disponible', observaciones: 'Otoño - Colores increíbles' },

    // ACONCAGUA
    { viaje: 'Expedición al Campo Base del Aconcagua', fecha_inicio: '2025-12-10', fecha_fin: '2025-12-16', cupos_totales: 8, cupos_ocupados: 6, precio_fecha: 580000, estado_fecha: 'disponible', observaciones: 'Primera expedición temporada - Mejores condiciones' },
    { viaje: 'Expedición al Campo Base del Aconcagua', fecha_inicio: '2026-01-05', fecha_fin: '2026-01-11', cupos_totales: 8, cupos_ocupados: 8, precio_fecha: 620000, estado_fecha: 'completo', observaciones: 'Temporada alta' },
    { viaje: 'Expedición al Campo Base del Aconcagua', fecha_inicio: '2026-01-20', fecha_fin: '2026-01-26', cupos_totales: 8, cupos_ocupados: 3, precio_fecha: 620000, estado_fecha: 'disponible', observaciones: 'Condiciones óptimas' },
    { viaje: 'Expedición al Campo Base del Aconcagua', fecha_inicio: '2026-02-08', fecha_fin: '2026-02-14', cupos_totales: 8, cupos_ocupados: 1, precio_fecha: 580000, estado_fecha: 'disponible', observaciones: 'Última expedición temporada' },

    // QUEBRADA HUMAHUACA
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2025-11-22', fecha_fin: '2025-11-22', cupos_totales: 20, cupos_ocupados: 15, precio_fecha: 32000, estado_fecha: 'disponible', observaciones: 'Primavera - Clima agradable' },
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2025-12-15', fecha_fin: '2025-12-15', cupos_totales: 20, cupos_ocupados: 18, precio_fecha: 34000, estado_fecha: 'disponible', observaciones: 'Temporada alta' },
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2026-01-12', fecha_fin: '2026-01-12', cupos_totales: 20, cupos_ocupados: 20, precio_fecha: 34000, estado_fecha: 'completo', observaciones: 'Sold out' },
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2026-02-08', fecha_fin: '2026-02-08', cupos_totales: 20, cupos_ocupados: 7, precio_fecha: 32000, estado_fecha: 'disponible', observaciones: 'Carnaval jujeño' },
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2026-03-15', fecha_fin: '2026-03-15', cupos_totales: 20, cupos_ocupados: 4, precio_fecha: 30000, estado_fecha: 'disponible', observaciones: 'Otoño - Menos turistas' },
    { viaje: 'Caminata por la Quebrada de Humahuaca', fecha_inicio: '2026-04-10', fecha_fin: '2026-04-10', cupos_totales: 20, cupos_ocupados: 0, precio_fecha: 30000, estado_fecha: 'disponible', observaciones: 'Semana Santa' },

    // PERITO MORENO
    { viaje: 'Trekking sobre el Glaciar Perito Moreno', fecha_inicio: '2025-11-18', fecha_fin: '2025-11-18', cupos_totales: 20, cupos_ocupados: 12, precio_fecha: 95000, estado_fecha: 'disponible', observaciones: 'Primavera - Glaciar activo' },
    { viaje: 'Trekking sobre el Glaciar Perito Moreno', fecha_inicio: '2025-12-08', fecha_fin: '2025-12-08', cupos_totales: 20, cupos_ocupados: 20, precio_fecha: 98000, estado_fecha: 'completo', observaciones: 'Temporada alta' },
    { viaje: 'Trekking sobre el Glaciar Perito Moreno', fecha_inicio: '2026-01-15', fecha_fin: '2026-01-15', cupos_totales: 20, cupos_ocupados: 16, precio_fecha: 98000, estado_fecha: 'disponible', observaciones: 'Verano - Mejores temperaturas' },
    { viaje: 'Trekking sobre el Glaciar Perito Moreno', fecha_inicio: '2026-02-20', fecha_fin: '2026-02-20', cupos_totales: 20, cupos_ocupados: 8, precio_fecha: 95000, estado_fecha: 'disponible', observaciones: 'Otoño temprano' },
    { viaje: 'Trekking sobre el Glaciar Perito Moreno', fecha_inicio: '2026-03-10', fecha_fin: '2026-03-10', cupos_totales: 20, cupos_ocupados: 3, precio_fecha: 92000, estado_fecha: 'disponible', observaciones: 'Fin de temporada - Oferta' },

    // CHAMPAQUÍ
    { viaje: 'Ascenso al Cerro Champaquí', fecha_inicio: '2025-11-29', fecha_fin: '2025-11-30', cupos_totales: 15, cupos_ocupados: 9, precio_fecha: 68000, estado_fecha: 'disponible', observaciones: 'Fin de semana largo' },
    { viaje: 'Ascenso al Cerro Champaquí', fecha_inicio: '2026-03-14', fecha_fin: '2026-03-15', cupos_totales: 15, cupos_ocupados: 11, precio_fecha: 68000, estado_fecha: 'disponible', observaciones: 'Otoño - Temperaturas ideales' },
    { viaje: 'Ascenso al Cerro Champaquí', fecha_inicio: '2026-04-11', fecha_fin: '2026-04-12', cupos_totales: 15, cupos_ocupados: 15, precio_fecha: 68000, estado_fecha: 'completo', observaciones: 'Semana Santa' },
    { viaje: 'Ascenso al Cerro Champaquí', fecha_inicio: '2026-05-02', fecha_fin: '2026-05-03', cupos_totales: 15, cupos_ocupados: 5, precio_fecha: 65000, estado_fecha: 'disponible', observaciones: 'Inicio de temporada baja' },

    // FITZ ROY
    { viaje: 'Trekking Laguna de los Tres - Fitz Roy', fecha_inicio: '2025-11-20', fecha_fin: '2025-11-20', cupos_totales: 10, cupos_ocupados: 7, precio_fecha: 52000, estado_fecha: 'disponible', observaciones: 'Primavera - Menos viento' },
    { viaje: 'Trekking Laguna de los Tres - Fitz Roy', fecha_inicio: '2025-12-18', fecha_fin: '2025-12-18', cupos_totales: 10, cupos_ocupados: 10, precio_fecha: 55000, estado_fecha: 'completo', observaciones: 'Temporada alta' },
    { viaje: 'Trekking Laguna de los Tres - Fitz Roy', fecha_inicio: '2026-01-08', fecha_fin: '2026-01-08', cupos_totales: 10, cupos_ocupados: 6, precio_fecha: 55000, estado_fecha: 'disponible', observaciones: 'Verano - Días largos' },
    { viaje: 'Trekking Laguna de los Tres - Fitz Roy', fecha_inicio: '2026-02-05', fecha_fin: '2026-02-05', cupos_totales: 10, cupos_ocupados: 3, precio_fecha: 55000, estado_fecha: 'disponible', observaciones: 'Temporada media' },
    { viaje: 'Trekking Laguna de los Tres - Fitz Roy', fecha_inicio: '2026-03-05', fecha_fin: '2026-03-05', cupos_totales: 10, cupos_ocupados: 1, precio_fecha: 52000, estado_fecha: 'disponible', observaciones: 'Fin de temporada - Oferta' },

    // CAÑÓN ATUEL
    { viaje: 'Aventura en el Cañón del Atuel', fecha_inicio: '2025-11-16', fecha_fin: '2025-11-16', cupos_totales: 25, cupos_ocupados: 18, precio_fecha: 42000, estado_fecha: 'disponible', observaciones: 'Río activo - Primavera' },
    { viaje: 'Aventura en el Cañón del Atuel', fecha_inicio: '2025-12-21', fecha_fin: '2025-12-21', cupos_totales: 25, cupos_ocupados: 25, precio_fecha: 45000, estado_fecha: 'completo', observaciones: 'Vacaciones de verano' },
    { viaje: 'Aventura en el Cañón del Atuel', fecha_inicio: '2026-01-18', fecha_fin: '2026-01-18', cupos_totales: 25, cupos_ocupados: 14, precio_fecha: 45000, estado_fecha: 'disponible', observaciones: 'Verano - Mejores condiciones' },
    { viaje: 'Aventura en el Cañón del Atuel', fecha_inicio: '2026-02-15', fecha_fin: '2026-02-15', cupos_totales: 25, cupos_ocupados: 9, precio_fecha: 42000, estado_fecha: 'disponible', observaciones: 'Carnaval' },
    { viaje: 'Aventura en el Cañón del Atuel', fecha_inicio: '2026-03-22', fecha_fin: '2026-03-22', cupos_totales: 25, cupos_ocupados: 6, precio_fecha: 40000, estado_fecha: 'disponible', observaciones: 'Otoño - Oferta' },

    // VOLCÁN LANÍN
    { viaje: 'Ascenso al Volcán Lanín', fecha_inicio: '2025-12-12', fecha_fin: '2025-12-14', cupos_totales: 6, cupos_ocupados: 4, precio_fecha: 180000, estado_fecha: 'disponible', observaciones: 'Primera expedición - Nieve óptima' },
    { viaje: 'Ascenso al Volcán Lanín', fecha_inicio: '2026-01-09', fecha_fin: '2026-01-11', cupos_totales: 6, cupos_ocupados: 6, precio_fecha: 190000, estado_fecha: 'completo', observaciones: 'Temporada alta' },
    { viaje: 'Ascenso al Volcán Lanín', fecha_inicio: '2026-02-06', fecha_fin: '2026-02-08', cupos_totales: 6, cupos_ocupados: 2, precio_fecha: 190000, estado_fecha: 'disponible', observaciones: 'Condiciones excelentes' },
    { viaje: 'Ascenso al Volcán Lanín', fecha_inicio: '2026-03-06', fecha_fin: '2026-03-08', cupos_totales: 6, cupos_ocupados: 1, precio_fecha: 180000, estado_fecha: 'disponible', observaciones: 'Última expedición temporada' },

    // SALINAS GRANDES
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2025-11-19', fecha_fin: '2025-11-19', cupos_totales: 16, cupos_ocupados: 10, precio_fecha: 28000, estado_fecha: 'disponible', observaciones: 'Primavera' },
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2025-12-10', fecha_fin: '2025-12-10', cupos_totales: 16, cupos_ocupados: 14, precio_fecha: 30000, estado_fecha: 'disponible', observaciones: 'Temporada alta' },
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2026-01-14', fecha_fin: '2026-01-14', cupos_totales: 16, cupos_ocupados: 16, precio_fecha: 30000, estado_fecha: 'completo', observaciones: 'Sold out' },
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2026-02-11', fecha_fin: '2026-02-11', cupos_totales: 16, cupos_ocupados: 8, precio_fecha: 28000, estado_fecha: 'disponible', observaciones: 'Verano' },
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2026-03-18', fecha_fin: '2026-03-18', cupos_totales: 16, cupos_ocupados: 3, precio_fecha: 26000, estado_fecha: 'disponible', observaciones: 'Otoño - Oferta' },
    { viaje: 'Aventura fotográfica en Salinas Grandes', fecha_inicio: '2026-04-15', fecha_fin: '2026-04-15', cupos_totales: 16, cupos_ocupados: 2, precio_fecha: 26000, estado_fecha: 'disponible', observaciones: 'Semana Santa' },

    // TALAMPAYA
    { viaje: 'Trekking en el Parque Nacional Talampaya', fecha_inicio: '2025-11-23', fecha_fin: '2025-11-23', cupos_totales: 20, cupos_ocupados: 13, precio_fecha: 38000, estado_fecha: 'disponible', observaciones: 'Primavera - Clima agradable' },
    { viaje: 'Trekking en el Parque Nacional Talampaya', fecha_inicio: '2026-03-20', fecha_fin: '2026-03-20', cupos_totales: 20, cupos_ocupados: 16, precio_fecha: 38000, estado_fecha: 'disponible', observaciones: 'Otoño - Mejor época' },
    { viaje: 'Trekking en el Parque Nacional Talampaya', fecha_inicio: '2026-04-05', fecha_fin: '2026-04-05', cupos_totales: 20, cupos_ocupados: 20, precio_fecha: 38000, estado_fecha: 'completo', observaciones: 'Semana Santa' },
    { viaje: 'Trekking en el Parque Nacional Talampaya', fecha_inicio: '2026-04-25', fecha_fin: '2026-04-25', cupos_totales: 20, cupos_ocupados: 7, precio_fecha: 36000, estado_fecha: 'disponible', observaciones: 'Otoño tardío' },
    { viaje: 'Trekking en el Parque Nacional Talampaya', fecha_inicio: '2026-05-10', fecha_fin: '2026-05-10', cupos_totales: 20, cupos_ocupados: 4, precio_fecha: 36000, estado_fecha: 'disponible', observaciones: 'Inicio temporada baja - Oferta' },
];

console.log(`\n📅 Insertando ${fechas.length} fechas...\n`);

let insertadas = 0;
let errores = 0;

for (const fecha of fechas) {
    const id_viaje = viajeMap[fecha.viaje];

    if (!id_viaje) {
        console.log(`❌ No se encontró viaje: ${fecha.viaje}`);
        errores++;
        continue;
    }

    try {
        await sequelize.query(`
            INSERT INTO fechas_viaje (
                id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados,
                precio_fecha, estado_fecha, observaciones
            ) VALUES (
                ${id_viaje}, '${fecha.fecha_inicio}', '${fecha.fecha_fin}',
                ${fecha.cupos_totales}, ${fecha.cupos_ocupados}, ${fecha.precio_fecha},
                '${fecha.estado_fecha}', '${fecha.observaciones}'
            )
        `);
        insertadas++;
        if (insertadas % 10 === 0) {
            console.log(`✅ ${insertadas} fechas insertadas...`);
        }
    } catch (error) {
        console.error(`❌ Error insertando fecha para ${fecha.viaje}:`, error.message);
        errores++;
    }
}

console.log(`\n🎉 Proceso completado!`);
console.log(`✅ Fechas insertadas: ${insertadas}`);
console.log(`❌ Errores: ${errores}\n`);

await sequelize.close();
