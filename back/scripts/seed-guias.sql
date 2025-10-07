-- Crear guías de prueba para testing
INSERT INTO guias (
  id_usuario, 
  especialidades, 
  experiencia_anos, 
  certificaciones, 
  idiomas, 
  tarifa_por_dia, 
  disponible, 
  activo, 
  descripcion, 
  calificacion_promedio,
  created_at,
  updated_at
) VALUES 
(1, 'Montañismo, Trekking de alta montaña', 8, 'Guía AAGM, Primeros Auxilios', 'Español, Inglés', 150.00, true, true, 'Guía especializado en montañismo con amplia experiencia en los Andes.', 4.8, NOW(), NOW()),
(2, 'Trekking, Senderismo', 5, 'Guía de Montaña Nivel 2', 'Español, Francés', 120.00, true, true, 'Experto en rutas de trekking y naturaleza patagónica.', 4.6, NOW(), NOW()),
(3, 'Escalada, Montañismo técnico', 12, 'Instructor EPGAMT, Rescate en montaña', 'Español, Inglés, Alemán', 200.00, true, true, 'Instructor de escalada con más de una década de experiencia.', 4.9, NOW(), NOW()),
(4, 'Trekking familiar, Interpretación de naturaleza', 3, 'Guía de Turismo, Primeros Auxilios', 'Español', 100.00, true, true, 'Especialista en actividades familiares y educación ambiental.', 4.4, NOW(), NOW()),
(5, 'Expediciones, Montañismo extremo', 15, 'Guía IFMGA, Medicina de montaña', 'Español, Inglés, Italiano', 250.00, false, false, 'Guía internacional con experiencia en expediciones de alta montaña.', 4.7, NOW(), NOW());
