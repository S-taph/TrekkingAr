import sequelize from "../src/config/database.js"
import "../src/models/associations.js"
import { Usuario } from "../src/models/associations.js"
import bcrypt from "bcryptjs"

const createAdminUser = async () => {
  try {
    console.log("👑 CREANDO USUARIO ADMINISTRADOR PARA TESTS")
    console.log("=".repeat(50))

    await sequelize.authenticate()
    console.log("✅ Conexión establecida")

    // Verificar si ya existe
    const existingAdmin = await Usuario.findOne({
      where: { email: "admin@trekking.com" },
    })

    if (existingAdmin) {
      console.log("⚠️ El usuario admin ya existe")
      console.log("📧 Email: admin@trekking.com")
      console.log("🔑 Password: 123456")
      return
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash("123456", 12)

    const admin = await Usuario.create({
      email: "admin@trekking.com",
      password_hash: hashedPassword,
      nombre: "Admin",
      apellido: "Sistema",
      telefono: "+54911234567",
      rol: "admin",
    })

    console.log("✅ Usuario administrador creado exitosamente!")
    console.log("📧 Email: admin@trekking.com")
    console.log("🔑 Password: 123456")
    console.log("👑 Rol: admin")
    console.log("\n🔥 Usa estas credenciales para hacer login y obtener el token JWT")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await sequelize.close()
  }
}

createAdminUser()
