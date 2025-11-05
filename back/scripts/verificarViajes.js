import sequelize from '../src/config/database.js';

const [viajes] = await sequelize.query(`
    SELECT id_viaje, titulo, destino, precio_base, dificultad,
           (SELECT COUNT(*) FROM fechas_viaje WHERE id_viaje = v.id_viaje) as fechas
    FROM viajes v
    WHERE id_viaje >= 4
    ORDER BY id_viaje
`);

console.log('\n📊 VIAJES INSERTADOS:\n');
viajes.forEach((v, i) => {
    console.log(`${i + 1}. ${v.titulo}`);
    console.log(`   Destino: ${v.destino || 'Sin destino'}`);
    console.log(`   Precio: $${parseFloat(v.precio_base).toLocaleString('es-AR')}`);
    console.log(`   Dificultad: ${v.dificultad}`);
    console.log(`   Fechas: ${v.fechas}\n`);
});

console.log(`\n✅ Total: ${viajes.length} viajes insertados\n`);

await sequelize.close();
