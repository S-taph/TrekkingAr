import sequelize from "../src/config/database.js"
import "../src/models/associations.js"

const testEndpoints = async () => {
  try {
    console.log("🧪 PREPARANDO TESTS DE ENDPOINTS")
    console.log("=".repeat(50))

    // 1. Verificar conexión
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos: OK")

    // 2. Sincronizar modelos
    await sequelize.sync({ alter: true })
    console.log("✅ Modelos sincronizados")

    console.log("\n📋 ENDPOINTS DISPONIBLES PARA POSTMAN:")
    console.log("=".repeat(50))

    const baseURL = "http://localhost:3000/api"

    console.log("\n🔐 AUTENTICACIÓN:")
    console.log(`POST ${baseURL}/auth/register`)
    console.log(`POST ${baseURL}/auth/login`)
    console.log(`GET  ${baseURL}/auth/profile (requiere token)`)

    console.log("\n🏔️ CATEGORÍAS:")
    console.log(`GET  ${baseURL}/categorias`)
    console.log(`GET  ${baseURL}/categorias/:id`)
    console.log(`POST ${baseURL}/categorias (admin)`)
    console.log(`PUT  ${baseURL}/categorias/:id (admin)`)
    console.log(`DEL  ${baseURL}/categorias/:id (admin)`)

    console.log("\n🥾 VIAJES:")
    console.log(`GET  ${baseURL}/viajes`)
    console.log(`GET  ${baseURL}/viajes/:id`)
    console.log(`GET  ${baseURL}/viajes/categoria/:categoriaId`)
    console.log(`POST ${baseURL}/viajes (admin)`)
    console.log(`PUT  ${baseURL}/viajes/:id (admin)`)
    console.log(`DEL  ${baseURL}/viajes/:id (admin)`)

    console.log("\n📅 RESERVAS:")
    console.log(`POST ${baseURL}/reservas (cliente)`)
    console.log(`GET  ${baseURL}/reservas/mis-reservas (cliente)`)
    console.log(`GET  ${baseURL}/reservas (admin)`)
    console.log(`PUT  ${baseURL}/reservas/:id/estado (admin)`)
    console.log(`PUT  ${baseURL}/reservas/:id/cancelar (cliente)`)

    console.log("\n🔍 DIAGNÓSTICO:")
    console.log(`GET  ${baseURL}/health`)
    console.log(`GET  ${baseURL}/test`)

    console.log("\n📝 DATOS DE PRUEBA PARA POSTMAN:")
    console.log("=".repeat(50))

    console.log("\n👤 REGISTRO DE USUARIO:")
    console.log(
      JSON.stringify(
        {
          email: "test@example.com",
          password: "123456",
          nombre: "Test",
          apellido: "User",
          telefono: "+54911234567",
          experiencia_previa: "Principiante",
        },
        null,
        2,
      ),
    )

    console.log("\n🔑 LOGIN:")
    console.log(
      JSON.stringify(
        {
          email: "test@example.com",
          password: "123456",
        },
        null,
        2,
      ),
    )

    console.log("\n🏔️ CREAR CATEGORÍA (admin):")
    console.log(
      JSON.stringify(
        {
          nombre: "Trekking de Prueba",
          descripcion: "Categoría creada desde Postman",
          url_imagen: "/images/test.jpg",
          orden_visualizacion: 5,
        },
        null,
        2,
      ),
    )

    console.log("\n🥾 CREAR VIAJE (admin):")
    console.log(
      JSON.stringify(
        {
          id_categoria: 1,
          titulo: "Viaje de Prueba",
          descripcion_corta: "Un viaje creado desde Postman",
          descripcion_completa: "Descripción completa del viaje de prueba",
          itinerario_detallado: "Día 1: Llegada. Día 2: Trekking.",
          dificultad: "facil",
          duracion_dias: 2,
          precio_base: 30000.0,
          imagen_principal_url: "/images/test-viaje.jpg",
          condiciones_fisicas: "Apto para principiantes",
          minimo_participantes: 2,
        },
        null,
        2,
      ),
    )

    console.log("\n📅 CREAR RESERVA (cliente):")
    console.log(
      JSON.stringify(
        {
          id_fecha_viaje: 1,
          cantidad_personas: 2,
          observaciones_reserva: "Reserva de prueba desde Postman",
        },
        null,
        2,
      ),
    )

    console.log("\n🔧 HEADERS NECESARIOS:")
    console.log("Content-Type: application/json")
    console.log("Authorization: Bearer <tu_token_jwt> (para rutas protegidas)")

    console.log("\n📊 PARÁMETROS DE QUERY DISPONIBLES:")
    console.log("=".repeat(50))

    console.log("\n🏔️ Categorías:")
    console.log("?activa=true/false")
    console.log("?incluir_viajes=true/false")

    console.log("\n🥾 Viajes:")
    console.log("?page=1&limit=10")
    console.log("?categoria=1")
    console.log("?dificultad=facil/moderado/dificil/extremo")
    console.log("?precio_min=10000&precio_max=50000")
    console.log("?duracion_min=1&duracion_max=7")
    console.log("?search=aconcagua")
    console.log("?activo=true/false")

    console.log("\n📅 Reservas:")
    console.log("?estado=pendiente/confirmada/cancelada/completada")
    console.log("?fecha_desde=2024-01-01&fecha_hasta=2024-12-31")
    console.log("?page=1&limit=10")

    console.log("\n🚀 SERVIDOR LISTO PARA TESTS!")
    console.log("Inicia el servidor con: npm run dev")
    console.log("Luego usa estos endpoints en Postman")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await sequelize.close()
  }
}

testEndpoints()
