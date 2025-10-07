import bcrypt from "bcryptjs"
import sequelize from "../src/config/database.js"
import Usuario from "../src/models/Usuario.js"
import Administrador from "../src/models/Administrador.js"
import "../src/models/associations.js"

const createAdminUser = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida")

    // Sincronizar modelos
    await sequelize.sync({ force: false })
    console.log("✅ Modelos sincronizados")

    // Verificar si ya existe un usuario admin
    const existingUser = await Usuario.findOne({
      where: { email: "admin@trekking.com" },
    })

    if (existingUser) {
      console.log("⚠️  Ya existe un usuario administrador")
      console.log("📧 Email: admin@trekking.com")
      console.log("🔑 Password: admin123")
      return
    }

    // Crear usuario base
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const usuario = await Usuario.create({
      nombre: "Administrador",
      apellido: "Principal",
      email: "admin@trekking.com",
      password_hash: hashedPassword,
      telefono: "1234567890",
      rol: "admin",
      activo: true,
    })

    // Crear registro de administrador
    await Administrador.create({
      id_usuario: usuario.id_usuarios,
      nivel: "super_admin",
      observaciones: "Usuario administrador principal creado automáticamente",
    })

    console.log("✅ Usuario administrador creado exitosamente")
    console.log("📧 Email: admin@trekking.com")
    console.log("🔑 Password: admin123")
  } catch (error) {
    console.error("❌ Error al crear usuario administrador:", error)
  } finally {
    await sequelize.close()
  }
}

createAdminUser()
