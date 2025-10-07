import sequelize from "../src/config/database.js"
import Categoria from "../src/models/Categoria.js"

const createDefaultCategories = async () => {
  try {
    console.log("🏷️ Creando categorías por defecto...")

    const categorias = [
      {
        nombre: "Trekking",
        descripcion: "Caminatas y senderismo en montaña",
        activa: true,
        orden_visualizacion: 1,
      },
      {
        nombre: "Montañismo",
        descripcion: "Escalada y ascensos a montañas",
        activa: true,
        orden_visualizacion: 2,
      },
      {
        nombre: "Aventura",
        descripcion: "Actividades de aventura y deportes extremos",
        activa: true,
        orden_visualizacion: 3,
      },
      {
        nombre: "Expedición",
        descripcion: "Expediciones de varios días en terrenos remotos",
        activa: true,
        orden_visualizacion: 4,
      },
    ]

    for (const categoriaData of categorias) {
      const [categoria, created] = await Categoria.findOrCreate({
        where: { nombre: categoriaData.nombre },
        defaults: categoriaData,
      })

      if (created) {
        console.log(`✅ Categoría creada: ${categoria.nombre}`)
      } else {
        console.log(`ℹ️ Categoría ya existe: ${categoria.nombre}`)
      }
    }

    console.log("✅ Categorías por defecto creadas exitosamente")

    // Mostrar todas las categorías
    const todasCategorias = await Categoria.findAll()
    console.log("\n📋 Categorías disponibles:")
    todasCategorias.forEach((cat) => {
      console.log(`- ID: ${cat.id_categoria}, Nombre: ${cat.nombre}`)
    })
  } catch (error) {
    console.error("❌ Error al crear categorías:", error)
  } finally {
    await sequelize.close()
  }
}

createDefaultCategories()
