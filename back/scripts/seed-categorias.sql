-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion, activa, orden_visualizacion, fecha_creacion, fecha_actualizacion) VALUES
('Trekking', 'Caminatas y senderismo en montaña', true, 1, NOW(), NOW()),
('Montañismo', 'Escalada y ascensos a montañas', true, 2, NOW(), NOW()),
('Aventura', 'Actividades de aventura y deportes extremos', true, 3, NOW(), NOW()),
('Expedición', 'Expediciones de varios días en terrenos remotos', true, 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
nombre = VALUES(nombre),
descripcion = VALUES(descripcion),
fecha_actualizacion = NOW();
