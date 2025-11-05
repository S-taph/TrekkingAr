-- Diagnóstico completo de cupos para fecha_viaje id = 4

-- 1. Ver información de la fecha de viaje
SELECT
    fv.id_fechas_viaje,
    v.titulo as viaje,
    fv.fecha_inicio,
    fv.fecha_fin,
    fv.cupos_totales,
    fv.cupos_ocupados,
    (fv.cupos_totales - fv.cupos_ocupados) as cupos_disponibles
FROM fechas_viaje fv
JOIN viajes v ON fv.id_viaje = v.id_viaje
WHERE fv.id_fechas_viaje = 4;

-- 2. Ver TODAS las reservas (incluyendo canceladas) para esta fecha
SELECT
    r.id_reserva,
    r.numero_reserva,
    r.cantidad_personas,
    r.estado_reserva,
    r.fecha_reserva,
    u.email as cliente_email,
    CONCAT(u.nombre, ' ', u.apellido) as cliente_nombre
FROM reservas r
JOIN usuarios u ON r.id_usuario = u.id_usuario
WHERE r.id_fecha_viaje = 4
ORDER BY r.fecha_reserva ASC;

-- 3. Calcular cupos ocupados solo por reservas NO canceladas
SELECT
    COUNT(*) as total_reservas,
    SUM(r.cantidad_personas) as total_personas,
    (SELECT cupos_totales FROM fechas_viaje WHERE id_fechas_viaje = 4) as cupos_totales,
    (SELECT cupos_ocupados FROM fechas_viaje WHERE id_fechas_viaje = 4) as cupos_en_db,
    (SUM(r.cantidad_personas) - (SELECT cupos_totales FROM fechas_viaje WHERE id_fechas_viaje = 4)) as sobrecupo
FROM reservas r
WHERE r.id_fecha_viaje = 4
  AND r.estado_reserva != 'cancelada';

-- 4. Ver detalle de reservas NO canceladas con acumulado
SELECT
    r.id_reserva,
    r.numero_reserva,
    r.cantidad_personas,
    r.estado_reserva,
    u.email,
    r.fecha_reserva,
    (SELECT SUM(r2.cantidad_personas)
     FROM reservas r2
     WHERE r2.id_fecha_viaje = 4
       AND r2.estado_reserva != 'cancelada'
       AND r2.fecha_reserva <= r.fecha_reserva) as acumulado
FROM reservas r
JOIN usuarios u ON r.id_usuario = u.id_usuario
WHERE r.id_fecha_viaje = 4
  AND r.estado_reserva != 'cancelada'
ORDER BY r.fecha_reserva ASC;

-- 5. Ver si hay items en carritos para esta fecha
SELECT
    ci.id as id_item,
    ci.cantidad,
    ci.precio_unitario,
    u.email as cliente_email,
    ci.fecha_creacion
FROM carrito_items ci
JOIN carrito c ON ci.id_carrito = c.id_carrito
JOIN usuarios u ON c.id_usuario = u.id_usuario
WHERE ci.id_fecha_viaje = 4
ORDER BY ci.fecha_creacion DESC;
