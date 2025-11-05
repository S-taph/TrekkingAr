-- Script para poblar la base de datos con 10 viajes completos
-- Nota: Las URLs de imágenes están como placeholders - deberás cargar las imágenes reales después

-- ============================================
-- INSERTAR VIAJES
-- ============================================

-- 1. REFUGIO FREY - Bariloche (Trekking - Moderado)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    1,
    'Trekking al Refugio Frey',
    'Una de las travesías más icónicas de Bariloche con vistas al Cerro Catedral y la laguna Toncek',
    'El Refugio Frey es uno de los trekkings más emblemáticos de Bariloche. Ubicado en el corazón de la cordillera, ofrece vistas espectaculares del Cerro Catedral, la Laguna Toncek y los famosos agujas de granito que atraen a escaladores de todo el mundo. La caminata atraviesa bosques de lengas y coihues, pasando por arroyos de deshielo y paisajes de alta montaña. Es ideal para quienes buscan una experiencia de trekking de día completo con la posibilidad de pernoctar en el refugio.',
    'DÍA COMPLETO:
• 08:00 - Encuentro en la base del Cerro Catedral
• 08:30 - Inicio de la caminata (4-5 horas de ascenso)
• 09:00 - Ingreso al bosque de lengas
• 11:00 - Primera vista panorámica desde el mirador
• 13:00 - Llegada al Refugio Frey y almuerzo
• 14:30 - Tiempo libre para explorar la laguna y las agujas de granito
• 16:00 - Inicio del descenso (3-4 horas)
• 19:00 - Regreso a la base del Cerro Catedral',
    'moderado',
    1,
    45000,
    '/uploads/viajes/refugio-frey.jpg',
    'Requiere buena condición física. Desnivel de 700 metros. Aproximadamente 16 km ida y vuelta. Se recomienda experiencia previa en trekking de montaña.',
    4,
    12,
    '• Guía profesional de montaña
• Transporte ida y vuelta desde San Carlos de Bariloche
• Seguro de accidentes personales
• Kit de primeros auxilios
• Comunicación satelital de emergencia
• Bastones de trekking (bajo pedido)',
    '• Almuerzo y snacks (llevar vianda personal)
• Bebidas
• Equipo personal de trekking
• Propinas para guías',
    'EQUIPAMIENTO OBLIGATORIO:
• Calzado de trekking con buen agarre
• Mochila de 25-30 litros
• Ropa de abrigo (campera impermeable, polar)
• Gorro, guantes y lentes de sol
• Protector solar factor 50+
• Botella de agua (1.5 litros mínimo)

MEJOR ÉPOCA: Noviembre a Abril (verano austral)
CLIMA: Variable de montaña - prepararse para cambios repentinos',
    1,
    1,
    'Bariloche',
    NULL
);

-- 2. ACONCAGUA BASE - Mendoza (Expedición - Difícil)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    4,
    'Expedición al Campo Base del Aconcagua',
    'Trekking de 7 días hasta Plaza de Mulas, el campo base del techo de América',
    'El Aconcagua, con sus 6,962 metros, es la montaña más alta de América y una de las siete cumbres del mundo. Esta expedición de 7 días te lleva hasta Plaza de Mulas, el campo base principal, atravesando el Valle de Horcones con vistas impresionantes de la pared sur del Aconcagua. Es una experiencia inolvidable para trekkeros experimentados que buscan desafiarse en alta montaña, sin necesidad de conocimientos técnicos de escalada.',
    'DÍA 1: Llegada a Mendoza - Reunión informativa y check de equipo
DÍA 2: Traslado a Penitentes (2,700 msnm) - Trekking a Confluencia (3,400 msnm) - 3 horas - Aclimatación
DÍA 3: Día de descanso en Confluencia - Caminata de aclimatación opcional al Mirador
DÍA 4: Trekking Confluencia a Plaza Francia (4,200 msnm) - Vista de la pared sur - Regreso a Confluencia
DÍA 5: Trekking Confluencia a Plaza de Mulas (4,300 msnm) - 7-8 horas - Campo base
DÍA 6: Día completo en Plaza de Mulas - Exploración del glaciar y vistas del Aconcagua
DÍA 7: Descenso a Penitentes (8-9 horas) - Regreso a Mendoza',
    'dificil',
    7,
    580000,
    '/uploads/viajes/aconcagua-base.jpg',
    'EXCELENTE condición física requerida. Experiencia previa en trekking de alta montaña OBLIGATORIA. Desnivel acumulado de 2,000 metros. Se recomienda hacer trekkings de aclimatación previos.',
    2,
    8,
    '• Guía especializado en alta montaña (certificado AAGM)
• Permiso de ingreso al Parque Provincial Aconcagua
• Transporte Mendoza-Penitentes-Mendoza
• 6 noches de camping con carpas dobles
• Servicio de mulas para carga de equipo colectivo
• Alimentación completa durante el trekking
• Carpa comedor y cocina
• Cocinero
• Seguro de rescate en montaña
• Comunicación satelital',
    '• Alojamiento en Mendoza (primera y última noche)
• Comidas en Mendoza
• Equipo personal de alta montaña
• Mula personal para equipo individual (disponible por $80,000 adicionales)
• Propinas',
    'EQUIPAMIENTO CRÍTICO:
• Bolsa de dormir -15°C mínimo
• Aislante térmico
• Ropa de alta montaña (capas múltiples)
• Calzado de trekking rígido
• Bastones telescópicos
• Mochila 60-70 litros
• Gafas con protección UV 400
• Buff y gorro térmico

PREPARACIÓN FÍSICA:
Comenzar entrenamiento 3 meses antes: cardio, resistencia, caminatas con carga.

ACLIMATACIÓN:
Fundamental para evitar mal de altura. Se recomienda llegar a Mendoza 2 días antes.

MEJOR ÉPOCA: Diciembre a Febrero',
    1,
    1,
    'Mendoza',
    NULL
);

-- 3. QUEBRADA DE HUMAHUACA - Jujuy (Trekking - Fácil)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    1,
    'Caminata por la Quebrada de Humahuaca',
    'Explora el patrimonio natural y cultural de la UNESCO con vistas al Cerro de los Siete Colores',
    'La Quebrada de Humahuaca es Patrimonio de la Humanidad por la UNESCO y ofrece paisajes únicos de colores increíbles. Esta caminata de día completo te lleva por senderos tradicionales, visitando pueblos históricos como Purmamarca, Tilcara y Humahuaca. Conocerás la cultura andina, probarás gastronomía local y disfrutarás de vistas panorámicas del Cerro de los Siete Colores y la Paleta del Pintor. Ideal para familias y principiantes.',
    'DÍA COMPLETO:
• 07:00 - Salida desde San Salvador de Jujuy
• 08:30 - Llegada a Purmamarca - Caminata al Mirador del Cerro de los Siete Colores (1 hora)
• 10:00 - Desayuno regional (humitas, tamales, api)
• 11:00 - Traslado a Maimará - Caminata a La Paleta del Pintor (1.5 horas)
• 13:00 - Almuerzo en Tilcara (locro o empanadas)
• 14:30 - Visita al Pucará de Tilcara (ruinas precolombinas)
• 16:00 - Traslado a Humahuaca - Caminata al Mirador del Hornocal (opcional - 30 min)
• 18:00 - Regreso a San Salvador de Jujuy',
    'facil',
    1,
    32000,
    '/uploads/viajes/quebrada-humahuaca.jpg',
    'Apto para todo público. Caminatas cortas de baja exigencia. Altura máxima 2,950 msnm. Se recomienda tomarse el primer día con calma para aclimatarse.',
    6,
    20,
    '• Guía local bilingüe (español/quechua)
• Transporte en vehículo climatizado
• Desayuno regional
• Almuerzo típico
• Entradas a sitios arqueológicos
• Degustación de productos regionales (coca, quinoa, algarrobo)
• Seguro de viaje',
    '• Cena
• Bebidas alcohólicas
• Compras personales en mercados artesanales',
    'RECOMENDACIONES ESPECIALES:
• Llevar efectivo (muchos lugares no aceptan tarjeta)
• Ropa en capas (mañanas frías, mediodía caluroso)
• Protector solar factor 50+ (radiación UV alta)
• Gorro y lentes de sol
• Cámara con batería extra (paisajes increíbles)
• Botella de agua reutilizable

ACLIMATACIÓN:
La altura puede afectar. Evitar comidas pesadas y alcohol el día anterior.

CULTURA LOCAL:
Respetar costumbres andinas. Pedir permiso antes de fotografiar personas.

MEJOR ÉPOCA: Todo el año, ideal Abril a Noviembre',
    1,
    1,
    'Jujuy',
    NULL
);

-- 4. GLACIAR PERITO MORENO - El Calafate (Aventura - Moderada)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    3,
    'Trekking sobre el Glaciar Perito Moreno',
    'Camina sobre el hielo milenario del glaciar más famoso de la Patagonia con crampones',
    'Una experiencia única en la vida: caminar sobre el hielo milenario del Glaciar Perito Moreno. Después de navegar por el Lago Argentino, te equiparás con crampones y arnés para realizar un trekking de 3 horas sobre el glaciar, explorando grietas azules, cuevas de hielo y lagunas de deshielo. Los guías expertos te enseñarán sobre glaciología mientras disfrutas de un whisky "on the rocks" con hielo milenario. Una aventura accesible pero emocionante.',
    'DÍA COMPLETO:
• 08:00 - Salida desde El Calafate
• 09:30 - Llegada al Puerto "Bajo las Sombras"
• 10:00 - Navegación de 20 minutos por el Lago Rico
• 10:30 - Desembarco y caminata por bosque patagónico hasta el glaciar (1 hora)
• 11:30 - Colocación de equipo: crampones, arnés y casco
• 11:45 - Inicio del trekking sobre el glaciar (3 horas)
    - Exploración de grietas y seracs
    - Caminata por el corazón del glaciar
    - Visita a cueva de hielo (si condiciones permiten)
    - Degustación de whisky con hielo glaciar
• 14:45 - Fin del trekking en hielo
• 15:00 - Regreso por el bosque y navegación de vuelta
• 16:00 - Visita a las pasarelas del Perito Moreno (2 horas libres)
• 18:00 - Regreso a El Calafate',
    'moderado',
    1,
    95000,
    '/uploads/viajes/glaciar-perito-moreno.jpg',
    'Condición física regular requerida. Edad entre 10 y 65 años. No se requiere experiencia previa en hielo. Los crampones facilitan el agarre. Caminata total: 4-5 horas (1 hora en tierra, 3 en hielo).',
    2,
    20,
    '• Guía especializado en glaciares (curso certificado de hielo)
• Transporte desde/hasta El Calafate
• Navegación por Lago Rico
• Equipo completo: crampones, arnés, casco
• Entrada al Parque Nacional Los Glaciares
• Degustación de whisky con hielo glaciar
• Seguro de accidentes personales
• Bastones de trekking',
    '• Almuerzo (hay confitería en pasarelas)
• Alquiler de ropa impermeable ($5,000 adicionales)
• Guantes impermeables (recomendado llevar propios)',
    'EQUIPAMIENTO OBLIGATORIO:
• Calzado de trekking con tobillo firme (NO zapatillas)
• Pantalón impermeable o de trekking
• Campera impermeable
• Abrigo polar o pluma
• Guantes impermeables
• Gorro térmico
• Lentes de sol con protección UV
• Protector solar factor 50+
• Mochila pequeña (20L)
• Botella de agua

IMPORTANTE:
• No es escalada en hielo, es caminata sobre superficie glaciar
• Los crampones se ajustan a cualquier calzado adecuado
• Suspendido por lluvia intensa o viento fuerte

RESTRICCIONES:
• No apto para embarazadas
• No apto para personas con problemas cardíacos severos
• Consultar si tiene limitaciones de movilidad

MEJOR ÉPOCA: Septiembre a Abril',
    1,
    1,
    'El Calafate',
    NULL
);

-- 5. CERRO CHAMPAQUÍ - Córdoba (Trekking - Moderada)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    1,
    'Ascenso al Cerro Champaquí',
    'Sube al techo de Córdoba (2,790 msnm) y disfruta de vistas 360° de las Sierras Grandes',
    'El Cerro Champaquí es el pico más alto de Córdoba y uno de los trekkings más populares del país. Este ascenso de 2 días te lleva desde Villa Alpina hasta la cumbre a 2,790 metros, atravesando paisajes increíbles: bosques de tabaquillo, pastizales de altura, arroyos cristalinos y vistas panorámicas de 360 grados. Pasarás la noche en el refugio Condor Cliff o en carpa, bajo un cielo estrellado incomparable. Perfecto para un fin de semana de aventura.',
    'DÍA 1:
• 08:00 - Salida desde Villa General Belgrano
• 10:00 - Llegada a Villa Alpina (punto de inicio - 1,800 msnm)
• 10:30 - Inicio del trekking - Ascenso por sendero del filo
• 12:00 - Paso por Puesto La Esquina (arroyo para cargar agua)
• 14:00 - Llegada al Refugio Condor Cliff (2,300 msnm) o zona de camping
• 14:30 - Almuerzo
• 16:00 - Caminata de aclimatación opcional al Mirador del Cóndor
• 19:00 - Cena
• 21:00 - Observación astronómica (cielo oscuro clase 1)

DÍA 2:
• 05:30 - Desayuno
• 06:00 - Inicio del ascenso final a la cumbre (2-3 horas)
• 08:30 - ¡CUMBRE DEL CHAMPAQUÍ! (2,790 msnm) - Fotos y celebración
• 09:30 - Descenso al refugio (1.5 horas)
• 11:00 - Desarmado de campamento y almuerzo
• 12:00 - Descenso a Villa Alpina (4 horas)
• 16:00 - Llegada a Villa Alpina
• 18:00 - Regreso a Villa General Belgrano',
    'moderado',
    2,
    68000,
    '/uploads/viajes/cerro-champaqui.jpg',
    'Buena condición física requerida. Desnivel de 1,000 metros. Aproximadamente 18 km ida y vuelta. No requiere experiencia técnica pero sí resistencia para caminatas de 5-6 horas.',
    4,
    15,
    '• Guía de montaña certificado
• Transporte Villa General Belgrano - Villa Alpina - Villa General Belgrano
• Alojamiento: noche en refugio (litera) o zona de camping
• Alimentación completa (1 almuerzo, 1 cena, 1 desayuno, 1 almuerzo + snacks)
• Carpa comedor
• Equipo de cocina
• Seguro de accidentes personales
• Botiquín de primeros auxilios',
    '• Bolsa de dormir (alquiler disponible $8,000)
• Aislante térmico (alquiler disponible $3,000)
• Carpa (si prefieres camping privado)
• Bebidas alcohólicas
• Equipo personal de trekking',
    'EQUIPAMIENTO NECESARIO:
• Mochila 40-50 litros
• Bolsa de dormir -5°C (noches frías)
• Aislante térmico
• Calzado de trekking impermeabilizado
• Ropa de abrigo (campera, polar, térmicas)
• Ropa de recambio
• Gorro, guantes, buff
• Linterna frontal
• Protector solar y labial
• Botella/camelback (2 litros)
• Bastones de trekking (muy recomendado)

FÍSICA:
Entrenamiento previo recomendado: caminatas de 3-4 horas con mochila cargada.

CLIMA:
Variable. Puede hacer frío incluso en verano. Vientos fuertes en la cumbre.

MEJOR ÉPOCA: Marzo a Mayo, Septiembre a Noviembre (evitar verano por tormentas)',
    1,
    0,
    'Córdoba',
    NULL
);

-- 6. FITZ ROY - El Chaltén (Trekking - Difícil)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    1,
    'Trekking Laguna de los Tres - Fitz Roy',
    'La caminata más icónica de la Patagonia con vista al mítico Cerro Fitz Roy',
    'Considerado uno de los 10 mejores trekkings del mundo, la caminata hasta la Laguna de los Tres ofrece la vista más espectacular del Cerro Fitz Roy (3,405 m), el pico más fotografiado de la Patagonia. Este trekking exigente de día completo atraviesa bosques de lengas, cruza el Río Blanco y asciende por un empinado sendero hasta la laguna glaciar, donde el Fitz Roy se refleja majestuosamente. El último tramo es muy duro pero la recompensa visual es indescriptible.',
    'DÍA COMPLETO:
• 06:00 - Encuentro en El Chaltén (inicio del sendero)
• 06:30 - Inicio del trekking con linternas (salida temprana para evitar viento)
• 08:00 - Primera parada: Mirador del Río Blanco
• 09:00 - Llegada al Campamento Poincenot (base del ascenso final)
• 09:15 - Desayuno con vista al Fitz Roy
• 10:00 - Inicio del ascenso final a Laguna de los Tres (400m desnivel en 1 hora)
• 11:00 - ¡LLEGADA A LAGUNA DE LOS TRES! - 2-3 horas de disfrute
    - Vista panorámica: Fitz Roy, Poincenot, Torre, Saint Exupéry
    - Sesión fotográfica épica
    - Almuerzo con la mejor vista de la Patagonia
• 14:00 - Inicio del descenso
• 15:00 - Parada en Campamento Poincenot (opcional: desvío a Laguna Capri)
• 17:30 - Regreso a El Chaltén

OPCIONAL: Algunos grupos prefieren camping en Poincenot para madrugada en la laguna.',
    'dificil',
    1,
    52000,
    '/uploads/viajes/fitz-roy-laguna-tres.jpg',
    'MUY BUENA condición física REQUERIDA. 25 km ida y vuelta con 800 metros de desnivel acumulado. El último tramo a la laguna es muy empinado (pendiente 40%). Duración total: 8-10 horas. Experiencia previa en trekking de montaña recomendada.',
    2,
    10,
    '• Guía experto en trekking patagónico
• Bastones de trekking
• Seguro de accidentes personales
• Equipo de comunicación
• Botiquín completo',
    '• Transporte (El Chaltén es peatonal, todos los senderos salen del pueblo)
• Alimentación (llevar vianda personal abundante)
• Alojamiento en El Chaltén
• Equipo personal de trekking',
    'EQUIPAMIENTO CRÍTICO:
• Calzado de trekking IMPERMEABILIZADO (terreno húmedo y rocoso)
• Mochila 30 litros
• Ropa impermeable (Gore-Tex o similar) - FUNDAMENTAL
• Sistema de capas (puede hacer 5°C o 20°C)
• Cortaviento de buena calidad
• Gorro, guantes, buff
• Protector solar factor 50+
• Lentes de sol categoría 4
• 2-3 litros de agua
• Comida de alto valor energético (frutos secos, chocolate, barritas)
• Linterna frontal (salida temprana)
• Bastones (MUY recomendado para el descenso)

CLIMA PATAGÓNICO:
Extremadamente variable e impredecible. Puede cambiar 4 veces en el día.
Vientos de hasta 100 km/h son comunes. Prepararse para TODO.

MEJOR ESTRATEGIA:
Salida temprana (6-7am) para evitar vientos de la tarde que pueden ser peligrosos.

SUSPENSIÓN:
El trekking puede suspenderse por vientos extremos o riesgo de aludes.

MEJOR ÉPOCA: Noviembre a Marzo (temporada alta: Diciembre-Febrero)',
    1,
    1,
    'El Chaltén',
    NULL
);

-- 7. CAÑON DEL ATUEL - Mendoza (Aventura - Fácil)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    3,
    'Aventura en el Cañón del Atuel',
    'Trekking, rafting y rappel en uno de los paisajes más espectaculares de Mendoza',
    'El Cañón del Atuel es una maravilla geológica tallada por el río durante millones de años, con formaciones rocosas de colores rojizos, naranjas y amarillos. Esta aventura multideporte combina trekking por el cañón, rafting en rápidos clase II-III, y rappel desde paredes de 20 metros. Es perfecto para familias aventureras y grupos de amigos que buscan adrenalina en un entorno natural impresionante. No se requiere experiencia previa.',
    'DÍA COMPLETO:
• 08:00 - Salida desde San Rafael
• 09:00 - Llegada al Valle Grande - Desayuno campestre
• 10:00 - Briefing de seguridad y distribución de equipo
• 10:30 - TREKKING por el Cañón (2 horas)
    - Sendero de los Miradores
    - Formaciones: El Sillón, El Submarino, Los Monjes
    - Fotos panorámicas
• 12:30 - Almuerzo asado criollo junto al río
• 14:00 - RAFTING en el Río Atuel (1.5 horas)
    - Rápidos clase II-III: El Saltador, El Vértigo
    - Tramos tranquilos para disfrutar el paisaje
    - Baño en aguas cristalinas
• 16:00 - RAPPEL desde pared del cañón (1 hora)
    - Descenso de 20 metros
    - Instructor personalizado
    - Todos los niveles (incluso primera vez)
• 17:00 - Merienda y descanso
• 18:00 - Regreso a San Rafael',
    'facil',
    1,
    42000,
    '/uploads/viajes/canon-atuel.jpg',
    'Apto para mayores de 12 años con condición física básica. No se requiere experiencia previa. Saber nadar es recomendable pero no obligatorio (se usan chalecos salvavidas). Aventura familiar.',
    6,
    25,
    '• Guías especializados en deportes de aventura
• Transporte desde/hasta San Rafael
• Desayuno campestre
• Almuerzo (asado completo con ensaladas)
• Merienda
• Equipo completo:
  - Rafting: chaleco salvavidas, casco, remo, traje de neoprene
  - Rappel: arnés, casco, cuerdas certificadas
• Seguro de aventura',
    '• Traje de baño (usar debajo del neoprene)
• Toalla y ropa de recambio
• Calzado adecuado para mojar
• Cámara acuática (las comunes no se pueden llevar al agua)',
    'QUÉ LLEVAR:
• Traje de baño
• Toalla
• Ropa de recambio completa
• Calzado deportivo que pueda mojarse (NO ojotas)
• Zapatillas extra para después
• Protector solar resistente al agua
• Lentes de sol con cinta de sujeción
• Gorro o gorra
• Mochila pequeña impermeable

VESTIMENTA PARA ACTIVIDADES:
• Rafting: se provee traje de neoprene (llevar traje de baño debajo)
• Trekking: ropa cómoda deportiva
• Rappel: pantalón largo (no shorts)

FOTOS:
• Se contratan fotógrafos opcionales ($15,000 adicional)
• O usar cámara acuática tipo GoPro

RESTRICCIONES:
• Edad mínima: 12 años
• Embarazadas: no pueden hacer rafting ni rappel (pueden hacer trekking)
• Problemas de espalda: consultar con médico antes de rappel

MEJOR ÉPOCA: Octubre a Abril (verano con río activo)',
    1,
    1,
    'San Rafael',
    NULL
);

-- 8. VOLCÁN LANÍN - Neuquén (Montañismo - Extrema)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    2,
    'Ascenso al Volcán Lanín',
    'Conquista el volcán perfecto de 3,776 metros en la frontera argentino-chilena',
    'El Volcán Lanín es uno de los ascensos más hermosos y desafiantes de la Patagonia argentina. Con su forma cónica perfecta y cubierto de nieve eterna, se eleva a 3,776 metros en el límite con Chile. Esta expedición de 3 días requiere excelente estado físico y experiencia en alta montaña con nieve. El ascenso técnico incluye uso de crampones, piolet y cuerda. Desde la cumbre, la vista 360° abarca los lagos patagónicos, otros volcanes y la cordillera hasta el infinito.',
    'DÍA 1: APROXIMACIÓN
• 08:00 - Salida desde San Martín de los Andes
• 10:00 - Llegada a Tromen (guardaparque) - Check de permisos
• 11:00 - Inicio del trekking de aproximación (6 horas)
• 13:00 - Paso por bosque de araucarias milenarias
• 17:00 - Llegada al Campo Base Espejo (2,300 msnm) - Armado de campamento
• 19:00 - Cena y briefing técnico
• 20:00 - Descanso (día de cumbre mañana)

DÍA 2: CUMBRE
• 04:00 - Desayuno
• 05:00 - Salida al ataque de cumbre con frontales
• 07:00 - Amanecer en la montaña - Colocación de crampones
• 09:00 - Paso del filo rocoso (requiere uso de cuerdas)
• 11:00 - Acceso al glaciar cumbre (uso intensivo de crampones y piolet)
• 13:00 - ¡CUMBRE DEL LANÍN! (3,776 msnm) - Fotos, registro, celebración
• 14:00 - Inicio del descenso (el más técnico y peligroso)
• 18:00 - Regreso al Campo Base - Cena
• 20:00 - Descanso

DÍA 3: DESCENSO Y REGRESO
• 08:00 - Desayuno
• 09:00 - Desarmado de campamento
• 10:00 - Inicio del descenso a Tromen (4 horas)
• 14:00 - Llegada a Tromen
• 15:00 - Regreso a San Martín de los Andes',
    'extremo',
    3,
    180000,
    '/uploads/viajes/volcan-lanin.jpg',
    'EXCELENTE condición física OBLIGATORIA. Experiencia previa en alta montaña con nieve y uso de crampones/piolet REQUERIDA. Ascensos previos de +3,000m recomendados. Desnivel: 1,500 metros. Jornada de cumbre: 12-14 horas. Terreno técnico con pendientes de 40-50°.',
    2,
    6,
    '• Guía de alta montaña (AAGM o EPGAMT)
• Guía de apoyo (para grupos mayores a 4)
• Permiso de ascenso (Parque Nacional Lanín)
• Transporte San Martín - Tromen - San Martín
• 2 noches de camping en Campo Base
• Alimentación completa (2 desayunos, 2 almuerzos, 2 cenas + snacks)
• Carpa comedor
• Equipo de cocina colectivo
• Cuerdas de seguridad y protecciones para filo rocoso
• Seguro de rescate en montaña
• Comunicación satelital',
    '• Alojamiento en San Martín de los Andes (noche previa y posterior)
• Comidas en San Martín
• Equipo personal técnico:
  - Carpa alta montaña
  - Bolsa de dormir -15°C
  - Crampones técnicos
  - Piolet
  - Arnés
  - Casco
  - Bastones
• Ropa técnica de alta montaña',
    'EQUIPAMIENTO TÉCNICO OBLIGATORIO:
• Carpa 4 estaciones (-15°C)
• Bolsa de dormir -15°C (plumas preferible)
• Aislante térmico
• Crampones semiautomáticos o automáticos
• Piolet técnico (70cm aprox)
• Arnés de montaña
• Casco de escalada
• Bastones telescópicos
• Mochila 50-60 litros

ROPA TÉCNICA:
• Botas rígidas de alta montaña (compatibles con crampones)
• Pantalón impermeable de montaña
• Campera impermeable y cortaviento Gore-Tex
• Campera de plumas
• Capas térmicas (primera y segunda)
• Guantes: térmicos + impermeables
• Gorro térmico, buff, pasamontañas
• Polainas

REQUISITOS PREVIOS:
• Curso de uso de crampones y piolet (o experiencia demostrable)
• Certificado médico de apto físico para alta montaña
• Ascensos previos recomendados: Tronador, Domuyo

PREPARACIÓN FÍSICA:
Iniciar entrenamiento 4-6 meses antes: cardio intenso, piernas, core, escaleras con carga.

MEJOR ÉPOCA: Diciembre a Marzo (ventana corta de condiciones óptimas)',
    1,
    1,
    'Neuquén',
    NULL
);

-- 9. SALINAS GRANDES - Jujuy/Salta (Aventura - Fácil)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    3,
    'Aventura fotográfica en Salinas Grandes',
    'Explora el desierto de sal más grande de Argentina con caminata y fotos creativas',
    'Las Salinas Grandes son el tercer salar más grande de Sudamérica, un desierto blanco de 12,000 hectáreas a 3,450 metros de altura. Esta aventura fotográfica te lleva a explorar este paisaje surrealista, caminar sobre la costra de sal, conocer cómo se extrae la sal de forma artesanal, y crear fotos con efectos de perspectiva increíbles. Incluye ascenso a la Cuesta de Lipán con sus 29 curvas y vistas panorámicas. Ideal para amantes de la fotografía.',
    'DÍA COMPLETO:
• 07:00 - Salida desde San Salvador de Jujuy o Purmamarca
• 08:00 - Inicio del ascenso por la Cuesta de Lipán (Ruta 52)
• 09:30 - Parada en el Mirador de las 29 Curvas (3,600 msnm) - Fotos panorámicas
• 10:30 - Llegada a Salinas Grandes (3,450 msnm)
• 10:45 - Caminata por el salar (2 horas)
    - Exploración de las piletas de evaporación
    - Visita a trabajadores salineros
    - Explicación del proceso de extracción
• 12:00 - SESIÓN FOTOGRÁFICA CREATIVA (1.5 horas)
    - Fotos con efectos de perspectiva y escala
    - Saltos, objetos, composiciones creativas
    - El guía actúa como fotógrafo profesional
• 13:30 - Almuerzo típico en Tres Morros (tamales, empanadas)
• 15:00 - Opcional: Visita a Puente del Diablo (formación geológica)
• 16:00 - Inicio del regreso
• 18:00 - Llegada a punto de origen',
    'facil',
    1,
    28000,
    '/uploads/viajes/salinas-grandes.jpg',
    'Apto para todo público y todas las edades. Caminata corta sobre superficie plana de sal. Altura: 3,450 msnm - puede afectar a personas sensibles al mal de altura. Tomarse con calma.',
    4,
    16,
    '• Guía local especializado en fotografía
• Transporte en vehículo 4x4 o camioneta
• Almuerzo regional
• Ingreso a las Salinas Grandes
• Props para fotos creativas (juguetes, objetos)
• Sesión fotográfica guiada (el guía toma fotos con tu celular/cámara)
• Degustación de productos regionales',
    '• Desayuno y cena
• Fotos impresas o en pendrive (se entregan digitales por WhatsApp sin cargo)',
    'TIPS FOTOGRÁFICOS:
• Llevar celular/cámara con batería CARGADA (baja más rápido con frío)
• Powerbank recomendado
• Usar modo HDR o ajustar exposición (el blanco puede quemar la foto)
• Limpiar lente frecuentemente (se llena de polvo de sal)

PROPS RECOMENDADOS PARA FOTOS:
• Figuras de dinosaurios o animales
• Botellas, copas, objetos cotidianos
• Prendas de colores brillantes (contrastan con el blanco)
• Creatividad: el límite es tu imaginación

QUÉ LLEVAR:
• Lentes de sol con protección UV (FUNDAMENTAL - reflejo intenso)
• Protector solar factor 50+
• Gorro o sombrero
• Ropa de colores vivos (resalta en fotos)
• Campera (hace frío con viento)
• Agua abundante (deshidratación rápida)
• Efectivo (artesanías locales no aceptan tarjeta)

ALTURA:
Subir lentamente. Evitar comidas pesadas. Masticar hojas de coca (legal y tradicional).

RESPETO CULTURAL:
Salinas Grandes es territorio de comunidades originarias. Respetar indicaciones.

MEJOR ÉPOCA: Todo el año. Abril-Octubre menos turístico.',
    1,
    1,
    'Jujuy',
    NULL
);

-- 10. PARQUE NACIONAL TALAMPAYA - La Rioja (Trekking - Moderada)
INSERT INTO viajes (
    id_categoria, titulo, descripcion_corta, descripcion_completa, itinerario_detallado,
    dificultad, duracion_dias, precio_base, imagen_principal_url, condiciones_fisicas,
    minimo_participantes, maximo_participantes, incluye, no_incluye, recomendaciones,
    activo, destacado, destino, id_destino
) VALUES (
    1,
    'Trekking en el Parque Nacional Talampaya',
    'Explora el cañón de paredes rojas de 150 metros con petroglifos y fósiles prehistóricos',
    'Talampaya es Patrimonio de la Humanidad UNESCO y uno de los paisajes más impresionantes de Argentina. Este trekking te lleva por el lecho del antiguo río que talló el cañón durante millones de años, rodeado de paredes verticales de 150 metros de altura color rojizo. Descubrirás petroglifos de pueblos originarios, el Jardín Botánico con flora autóctona, formaciones como La Catedral y El Monje, y aprenderás sobre los dinosaurios que habitaron esta zona hace 250 millones de años.',
    'DÍA COMPLETO:
• 08:00 - Salida desde Villa Unión
• 10:00 - Llegada al Centro de Interpretación del Parque Nacional Talampaya
• 10:30 - Briefing educativo sobre geología y paleontología
• 11:00 - Inicio del trekking por el Cañón (3 horas)
    - Caminata por el cauce seco del río
    - Paredes de 150 metros de altura
    - La Puerta del Cañón (entrada estrecha)
    - El Monje (formación de 80 metros)
• 12:00 - Petroglifos de la Cultura Ciénaga (1,500 años de antigüedad)
• 12:30 - La Catedral: explanada con acústica natural impresionante
• 13:00 - Almuerzo picnic en el Jardín Botánico
• 14:00 - Visita a la Ciudad Perdida (formaciones caprichosas)
• 15:00 - Opcional: Circuito de los Cajones (caminata entre paredes de 5 metros de ancho)
• 16:30 - Visita al Museo Paleontológico
• 17:30 - Regreso a Villa Unión',
    'moderado',
    1,
    38000,
    '/uploads/viajes/talampaya.jpg',
    'Condición física regular. Caminata de 10 km por terreno arenoso (más exigente que pavimento). Calor intenso en verano (35-40°C). Hidratación constante fundamental. Apto para mayores de 8 años.',
    6,
    20,
    '• Guía baqueano especializado (formado por APN)
• Transporte desde/hasta Villa Unión
• Entrada al Parque Nacional Talampaya
• Almuerzo tipo picnic
• Bastones de trekking
• Agua mineral (2 litros por persona)
• Visita al Museo Paleontológico',
    '• Desayuno y cena
• Propinas
• Fotografías profesionales (servicio opcional $12,000)',
    'PROTECCIÓN SOLAR EXTREMA:
• Protector solar factor 50+ aplicar cada 2 horas
• Gorro de ala ancha o sombrero
• Buff o pañuelo para cuello
• Lentes de sol categoría 3-4
• Ropa clara de manga larga (mejor que corta)

HIDRATACIÓN:
• Llevar mínimo 2 litros de agua adicionales
• Beber constantemente (incluso sin sed)
• Evitar bebidas alcohólicas o azucaradas

CALZADO:
• Zapatillas de trekking o deportivas con buen agarre
• NO sandalias (terreno arenoso y pedregoso)
• Medias sin costuras (prevenir ampollas)

FOTOGRAFÍA:
• Las mejores fotos: 11am-2pm (luz cenital resalta el rojo)
• Cámara con sensor limpio (hay mucho polvo)
• Filtro polarizador recomendado

CLIMA DESÉRTICO:
• Verano: 35-45°C (extremo) - salidas más temprano
• Invierno: 10-20°C (agradable) - mejor época
• Lluvia: MUY rara, pero si llueve se suspende (crecidas repentinas)

GEOLOGÍA Y PALEONTOLOGÍA:
El guía explicará formaciones de la Era Triásica y descubrimientos de dinosaurios.

MEJOR ÉPOCA: Marzo a Mayo, Septiembre a Noviembre (evitar verano extremo)',
    1,
    0,
    'La Rioja',
    NULL
);

-- ============================================
-- INSERTAR FECHAS PARA CADA VIAJE
-- ============================================

-- FECHAS VIAJE 1: Refugio Frey (temporada nov-abr)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(1, '2025-11-15', '2025-11-15', 12, 3, 45000, 'disponible', 'Temporada primavera - Flores de montaña'),
(1, '2025-12-06', '2025-12-06', 12, 8, 45000, 'disponible', 'Verano - Nieve derretida'),
(1, '2025-12-28', '2025-12-28', 12, 12, 48000, 'completo', 'Temporada alta - Fin de año'),
(1, '2026-01-10', '2026-01-10', 12, 2, 48000, 'disponible', 'Temporada alta - Verano'),
(1, '2026-02-14', '2026-02-14', 12, 0, 45000, 'disponible', 'San Valentín especial'),
(1, '2026-03-08', '2026-03-08', 12, 5, 45000, 'disponible', 'Otoño - Colores increíbles');

-- FECHAS VIAJE 2: Aconcagua Base (temporada dic-feb)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(2, '2025-12-10', '2025-12-16', 8, 6, 580000, 'disponible', 'Primera expedición temporada - Mejores condiciones'),
(2, '2026-01-05', '2026-01-11', 8, 8, 620000, 'completo', 'Temporada alta'),
(2, '2026-01-20', '2026-01-26', 8, 3, 620000, 'disponible', 'Condiciones óptimas'),
(2, '2026-02-08', '2026-02-14', 8, 1, 580000, 'disponible', 'Última expedición temporada');

-- FECHAS VIAJE 3: Quebrada de Humahuaca (todo el año)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(3, '2025-11-22', '2025-11-22', 20, 15, 32000, 'disponible', 'Primavera - Clima agradable'),
(3, '2025-12-15', '2025-12-15', 20, 18, 34000, 'disponible', 'Temporada alta'),
(3, '2026-01-12', '2026-01-12', 20, 20, 34000, 'completo', 'Sold out'),
(3, '2026-02-08', '2026-02-08', 20, 7, 32000, 'disponible', 'Carnaval jujeño'),
(3, '2026-03-15', '2026-03-15', 20, 4, 30000, 'disponible', 'Otoño - Menos turistas'),
(3, '2026-04-10', '2026-04-10', 20, 0, 30000, 'disponible', 'Semana Santa');

-- FECHAS VIAJE 4: Glaciar Perito Moreno (temporada sep-abr)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(4, '2025-11-18', '2025-11-18', 20, 12, 95000, 'disponible', 'Primavera - Glaciar activo'),
(4, '2025-12-08', '2025-12-08', 20, 20, 98000, 'completo', 'Temporada alta'),
(4, '2026-01-15', '2026-01-15', 20, 16, 98000, 'disponible', 'Verano - Mejores temperaturas'),
(4, '2026-02-20', '2026-02-20', 20, 8, 95000, 'disponible', 'Otoño temprano'),
(4, '2026-03-10', '2026-03-10', 20, 3, 92000, 'disponible', 'Fin de temporada - Oferta');

-- FECHAS VIAJE 5: Cerro Champaquí (temporada mar-may, sep-nov)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(5, '2025-11-29', '2025-11-30', 15, 9, 68000, 'disponible', 'Fin de semana largo'),
(5, '2026-03-14', '2026-03-15', 15, 11, 68000, 'disponible', 'Otoño - Temperaturas ideales'),
(5, '2026-04-11', '2026-04-12', 15, 15, 68000, 'completo', 'Semana Santa'),
(5, '2026-05-02', '2026-05-03', 15, 5, 65000, 'disponible', 'Inicio de temporada baja');

-- FECHAS VIAJE 6: Fitz Roy (temporada nov-mar)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(6, '2025-11-20', '2025-11-20', 10, 7, 52000, 'disponible', 'Primavera - Menos viento'),
(6, '2025-12-18', '2025-12-18', 10, 10, 55000, 'completo', 'Temporada alta'),
(6, '2026-01-08', '2026-01-08', 10, 6, 55000, 'disponible', 'Verano - Días largos'),
(6, '2026-02-05', '2026-02-05', 10, 3, 55000, 'disponible', 'Temporada media'),
(6, '2026-03-05', '2026-03-05', 10, 1, 52000, 'disponible', 'Fin de temporada - Oferta');

-- FECHAS VIAJE 7: Cañón del Atuel (temporada oct-abr)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(7, '2025-11-16', '2025-11-16', 25, 18, 42000, 'disponible', 'Río activo - Primavera'),
(7, '2025-12-21', '2025-12-21', 25, 25, 45000, 'completo', 'Vacaciones de verano'),
(7, '2026-01-18', '2026-01-18', 25, 14, 45000, 'disponible', 'Verano - Mejores condiciones'),
(7, '2026-02-15', '2026-02-15', 25, 9, 42000, 'disponible', 'Carnaval'),
(7, '2026-03-22', '2026-03-22', 25, 6, 40000, 'disponible', 'Otoño - Oferta');

-- FECHAS VIAJE 8: Volcán Lanín (temporada dic-mar)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(8, '2025-12-12', '2025-12-14', 6, 4, 180000, 'disponible', 'Primera expedición - Nieve óptima'),
(8, '2026-01-09', '2026-01-11', 6, 6, 190000, 'completo', 'Temporada alta'),
(8, '2026-02-06', '2026-02-08', 6, 2, 190000, 'disponible', 'Condiciones excelentes'),
(8, '2026-03-06', '2026-03-08', 6, 1, 180000, 'disponible', 'Última expedición temporada');

-- FECHAS VIAJE 9: Salinas Grandes (todo el año)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(9, '2025-11-19', '2025-11-19', 16, 10, 28000, 'disponible', 'Primavera'),
(9, '2025-12-10', '2025-12-10', 16, 14, 30000, 'disponible', 'Temporada alta'),
(9, '2026-01-14', '2026-01-14', 16, 16, 30000, 'completo', 'Sold out'),
(9, '2026-02-11', '2026-02-11', 16, 8, 28000, 'disponible', 'Verano'),
(9, '2026-03-18', '2026-03-18', 16, 3, 26000, 'disponible', 'Otoño - Oferta'),
(9, '2026-04-15', '2026-04-15', 16, 2, 26000, 'disponible', 'Semana Santa');

-- FECHAS VIAJE 10: Talampaya (mejor época mar-may, sep-nov)
INSERT INTO fechas_viaje (id_viaje, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, precio_fecha, estado_fecha, observaciones) VALUES
(10, '2025-11-23', '2025-11-23', 20, 13, 38000, 'disponible', 'Primavera - Clima agradable'),
(10, '2026-03-20', '2026-03-20', 20, 16, 38000, 'disponible', 'Otoño - Mejor época'),
(10, '2026-04-05', '2026-04-05', 20, 20, 38000, 'completo', 'Semana Santa'),
(10, '2026-04-25', '2026-04-25', 20, 7, 36000, 'disponible', 'Otoño tardío'),
(10, '2026-05-10', '2026-05-10', 20, 4, 36000, 'disponible', 'Inicio temporada baja - Oferta');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- RESUMEN:
-- 10 viajes creados con información completa y realista
-- 56 fechas distribuidas en las temporadas apropiadas
-- URLs de imágenes como placeholders (/uploads/viajes/nombre-viaje.jpg)
-- Precios variados: desde $26,000 hasta $620,000
-- Dificultades: Fácil, Moderada, Difícil, Extrema
-- Destinos: Bariloche, Mendoza, Jujuy, El Calafate, Córdoba, El Chaltén, San Rafael, Neuquén, La Rioja
-- Categorías: Trekking (5), Expedición (1), Aventura (3), Montañismo (1)