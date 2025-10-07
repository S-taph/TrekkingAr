import sequelize from "../src/config/database.js"
import "../src/models/associations.js"
import { Usuario, Categoria, Viaje } from "../src/models/associations.js"

const diagnoseDatabase = async () => {
  try {
    console.log("🔍 DIAGNÓSTICO COMPLETO DE LA BASE DE DATOS")
    console.log("=".repeat(50))

    // 1. Verificar conexión
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos: OK")
    console.log(`📍 Base de datos: ${process.env.DB_NAME}`)
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)

    // 2. Listar todas las tablas
    const [tables] = await sequelize.query("SHOW TABLES")
    console.log("\n📋 Tablas en la base de datos:")
    tables.forEach((table) => {
      console.log(`- ${Object.values(table)[0]}`)
    })

    // 3. Contar registros en cada tabla
    console.log("\n📊 CONTEO DE REGISTROS:")

    try {
      const usuariosCount = await Usuario.count()
      console.log(`👤 Usuarios: ${usuariosCount}`)
    } catch (error) {
      console.log(`❌ Error contando usuarios: ${error.message}`)
    }

    try {
      const categoriasCount = await Categoria.count()
      console.log(`🏔️ Categorías: ${categoriasCount}`)
    } catch (error) {
      console.log(`❌ Error contando categorías: ${error.message}`)
    }

    try {
      const viajesCount = await Viaje.count()
      console.log(`🥾 Viajes: ${viajesCount}`)
    } catch (error) {
      console.log(`❌ Error contando viajes: ${error.message}`)
    }

    // 4. Mostrar datos específicos de categorías
    console.log("\n🏔️ DATOS DE CATEGORÍAS:")
    try {
      const categorias = await Categoria.findAll({
        attributes: ["id_categoria", "nombre", "activa", "orden_visualizacion"],
      })

      if (categorias.length === 0) {
        console.log("⚠️ No se encontraron categorías")
      } else {
        categorias.forEach((cat) => {
          console.log(`- ID: ${cat.id_categoria} | Nombre: "${cat.nombre}" | Activa: ${cat.activa}`)
        })
      }
    } catch (error) {
      console.log(`❌ Error obteniendo categorías: ${error.message}`)
    }

    // 5. Query directa a la tabla categorias
    console.log("\n🔍 QUERY DIRECTA A LA TABLA:")
    try {
      const [results] = await sequelize.query("SELECT * FROM categorias LIMIT 5")
      console.log("Resultados directos:", results)
    } catch (error) {
      console.log(`❌ Error en query directa: ${error.message}`)
    }

    // 6. Verificar estructura de la tabla categorias
    console.log("\n🏗️ ESTRUCTURA DE LA TABLA CATEGORIAS:")
    try {
      const [structure] = await sequelize.query("DESCRIBE categorias")
      structure.forEach((field) => {
        console.log(`- ${field.Field}: ${field.Type} (${field.Null === "YES" ? "NULL" : "NOT NULL"})`)
      })
    } catch (error) {
      console.log(`❌ Error obteniendo estructura: ${error.message}`)
    }
  } catch (error) {
    console.error("❌ Error general:", error)
  } finally {
    await sequelize.close()
  }
}

diagnoseDatabase()
