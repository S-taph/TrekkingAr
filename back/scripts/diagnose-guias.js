import sequelize from "../src/config/database.js"
import Usuario from "../src/models/Usuario.js"
import Guia from "../src/models/Guia.js"
import "../src/models/associations.js"

async function diagnoseGuias() {
  try {
    console.log("[v0] === DIAGNÓSTICO DE GUÍAS ===")

    // Verificar conexión a la base de datos
    await sequelize.authenticate()
    console.log("[v0] ✓ Conexión a la base de datos exitosa")

    // Verificar si las tablas existen
    const [tables] = await sequelize.query("SHOW TABLES")
    const tableNames = tables.map((t) => Object.values(t)[0])
    console.log("[v0] Tablas existentes:", tableNames)

    const hasUsuarios = tableNames.includes("usuarios")
    const hasGuias = tableNames.includes("guias")

    console.log("[v0] Tabla usuarios existe:", hasUsuarios)
    console.log("[v0] Tabla guias existe:", hasGuias)

    if (!hasUsuarios || !hasGuias) {
      console.log("[v0] ❌ Faltan tablas necesarias")
      return
    }

    // Verificar estructura de la tabla guias
    const [guiaColumns] = await sequelize.query("DESCRIBE guias")
    console.log("[v0] Estructura de tabla guias:")
    guiaColumns.forEach((col) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key}`)
    })

    // Contar registros
    const usuarioCount = await Usuario.count()
    const guiaCount = await Guia.count()

    console.log(`[v0] Total usuarios: ${usuarioCount}`)
    console.log(`[v0] Total guías: ${guiaCount}`)

    // Verificar usuarios con rol guía
    const usuariosGuia = await Usuario.findAll({
      where: { rol: "guia" },
      attributes: ["id_usuarios", "nombre", "apellido", "email", "rol"],
    })

    console.log(`[v0] Usuarios con rol guía: ${usuariosGuia.length}`)
    usuariosGuia.forEach((u) => {
      console.log(`  - ${u.nombre} ${u.apellido} (ID: ${u.id_usuarios})`)
    })

    // Intentar consulta con asociaciones
    try {
      const guiasConUsuario = await Guia.findAll({
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuarios", "nombre", "apellido", "email"],
          },
        ],
        limit: 5,
      })

      console.log(`[v0] ✓ Consulta con asociaciones exitosa. Guías encontrados: ${guiasConUsuario.length}`)

      if (guiasConUsuario.length > 0) {
        console.log("[v0] Ejemplo de guía con usuario:")
        console.log(JSON.stringify(guiasConUsuario[0].toJSON(), null, 2))
      }
    } catch (assocError) {
      console.log("[v0] ❌ Error en consulta con asociaciones:", assocError.message)
      console.log("[v0] Stack trace:", assocError.stack)
    }
  } catch (error) {
    console.error("[v0] Error en diagnóstico:", error.message)
    console.error("[v0] Stack trace:", error.stack)
  } finally {
    await sequelize.close()
  }
}

diagnoseGuias()
