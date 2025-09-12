import sequelize from "../src/config/database.js"
import "../src/models/associations.js"
import { Usuario, Categoria, Viaje, Compra, FechaViaje } from "../src/models/associations.js"
import bcrypt from "bcryptjs"

const seedDatabase = async () => {
  try {
    console.log("🌱 Iniciando seed de la base de datos...")

    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: true })
    console.log("✅ Tablas creadas correctamente")

    // 1. Crear usuarios de prueba
    const hashedPassword = await bcrypt.hash("123456", 12)

    const usuarios = await Usuario.bulkCreate([
      {
        email: "admin@trekking.com",
        password_hash: hashedPassword,
        nombre: "Admin",
        apellido: "Sistema",
        telefono: "+54911234567",
        rol: "admin",
      },
      {
        email: "cliente1@gmail.com",
        password_hash: hashedPassword,
        nombre: "Juan",
        apellido: "Pérez",
        telefono: "+54911111111",
        contacto_emergencia: "María Pérez",
        telefono_emergencia: "+54922222222",
        experiencia_previa: "He hecho trekking en Bariloche y Mendoza",
        rol: "cliente",
      },
      {
        email: "cliente2@gmail.com",
        password_hash: hashedPassword,
        nombre: "Ana",
        apellido: "García",
        telefono: "+54933333333",
        contacto_emergencia: "Carlos García",
        telefono_emergencia: "+54944444444",
        experiencia_previa: "Principiante, pero con muchas ganas de aprender",
        rol: "cliente",
      },
    ])

    console.log("✅ Usuarios creados:", usuarios.length)

    // 2. Crear categorías
    const categorias = await Categoria.bulkCreate([
      {
        nombre: "Trekking de Montaña",
        descripcion: "Aventuras en las montañas más altas de Argentina",
        url_imagen: "/images/montana.jpg",
        orden_visualizacion: 1,
      },
      {
        nombre: "Senderismo Urbano",
        descripcion: "Caminatas por senderos cercanos a la ciudad",
        url_imagen: "/images/urbano.jpg",
        orden_visualizacion: 2,
      },
      {
        nombre: "Expediciones Extremas",
        descripcion: "Para aventureros experimentados que buscan desafíos",
        url_imagen: "/images/extremo.jpg",
        orden_visualizacion: 3,
      },
      {
        nombre: "Trekking Familiar",
        descripcion: "Aventuras aptas para toda la familia",
        url_imagen: "/images/familia.jpg",
        orden_visualizacion: 4,
      },
    ])

    console.log("✅ Categorías creadas:", categorias.length)

    // 3. Crear viajes
    const viajes = await Viaje.bulkCreate([
      {
        id_categoria: categorias[0].id_categoria,
        titulo: "Aconcagua - Campamento Base",
        descripcion_corta: "Trekking al campamento base del Aconcagua, la montaña más alta de América",
        descripcion_completa:
          "Una aventura única hacia el campamento base del Cerro Aconcagua. Experimentarás paisajes únicos de la cordillera de los Andes mientras te acercas a la montaña más alta del hemisferio occidental.",
        itinerario_detallado:
          "Día 1: Llegada a Mendoza. Día 2-3: Aclimatación. Día 4-6: Trekking al campamento base. Día 7: Regreso.",
        dificultad: "dificil",
        duracion_dias: 7,
        precio_base: 85000.0,
        imagen_principal_url: "/images/aconcagua.jpg",
        condiciones_fisicas: "Excelente estado físico requerido. Experiencia previa en alta montaña recomendada.",
        minimo_participantes: 4,
      },
      {
        id_categoria: categorias[1].id_categoria,
        titulo: "Cerro San Cristóbal - Santiago",
        descripcion_corta: "Caminata urbana con vistas panorámicas de Santiago",
        descripcion_completa:
          "Una caminata perfecta para comenzar en el mundo del trekking. Disfruta de vistas panorámicas de la ciudad de Santiago desde uno de sus cerros más emblemáticos.",
        itinerario_detallado:
          "Salida temprano por la mañana, ascenso de 2 horas, tiempo en la cima para fotos y almuerzo, descenso por la tarde.",
        dificultad: "facil",
        duracion_dias: 1,
        precio_base: 15000.0,
        imagen_principal_url: "/images/san-cristobal.jpg",
        condiciones_fisicas: "Apto para principiantes. Nivel básico de estado físico.",
        minimo_participantes: 2,
      },
      {
        id_categoria: categorias[3].id_categoria,
        titulo: "Laguna Esmeralda - Ushuaia",
        descripcion_corta: "Caminata familiar a la hermosa Laguna Esmeralda",
        descripcion_completa:
          "Una caminata perfecta para hacer en familia. La Laguna Esmeralda te sorprenderá con sus aguas de color turquesa en medio del bosque fueguino.",
        itinerario_detallado:
          "Caminata de 3 horas ida y vuelta por sendero bien marcado. Almuerzo junto a la laguna. Observación de flora y fauna local.",
        dificultad: "facil",
        duracion_dias: 1,
        precio_base: 25000.0,
        imagen_principal_url: "/images/laguna-esmeralda.jpg",
        condiciones_fisicas: "Apto para niños mayores de 8 años. Caminata en terreno irregular.",
        minimo_participantes: 3,
      },
    ])

    console.log("✅ Viajes creados:", viajes.length)

    // 4. Crear fechas de viajes
    const fechasViajes = []
    for (const viaje of viajes) {
      const fechasParaViaje = await FechaViaje.bulkCreate([
        {
          id_viaje: viaje.id_viaje,
          fecha_inicio: new Date("2024-07-15"),
          fecha_fin: new Date(new Date("2024-07-15").getTime() + viaje.duracion_dias * 24 * 60 * 60 * 1000),
          cupos_disponibles: 8,
          cupos_ocupados: 2,
          estado_fecha: "disponible",
        },
        {
          id_viaje: viaje.id_viaje,
          fecha_inicio: new Date("2024-08-10"),
          fecha_fin: new Date(new Date("2024-08-10").getTime() + viaje.duracion_dias * 24 * 60 * 60 * 1000),
          cupos_disponibles: 10,
          cupos_ocupados: 0,
          estado_fecha: "disponible",
        },
      ])
      fechasViajes.push(...fechasParaViaje)
    }

    console.log("✅ Fechas de viajes creadas:", fechasViajes.length)

    // 5. Crear algunas compras de ejemplo
    const compras = await Compra.bulkCreate([
      {
        numero_compra: "COMP-001",
        id_usuario: usuarios[1].id_usuarios,
        total_compra: 25000.0,
        estado_compra: "pagada",
      },
      {
        numero_compra: "COMP-002",
        id_usuario: usuarios[2].id_usuarios,
        total_compra: 85000.0,
        estado_compra: "pendiente",
      },
    ])

    console.log("✅ Compras creadas:", compras.length)

    console.log("\n🎉 ¡Seed completado exitosamente!")
    console.log("\n📋 Datos de prueba creados:")
    console.log("👤 Usuarios: 3 (1 admin, 2 clientes)")
    console.log("🏔️ Categorías: 4")
    console.log("🥾 Viajes: 3")
    console.log("📅 Fechas de viajes: 6")
    console.log("💳 Compras: 2")
    console.log("\n🔑 Contraseña para todos los usuarios: 123456")
    console.log("\n🚀 ¡El servidor está listo para usar!")
  } catch (error) {
    console.error("❌ Error durante el seed:", error)
  } finally {
    await sequelize.close()
  }
}

seedDatabase()
