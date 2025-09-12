import express from "express"

console.log("🔍 Diagnosticando rutas...")

try {
  // Probar importaciones individuales
  console.log("📦 Probando importaciones...")

  const authRoutes = await import("../src/routes/authRoutes.js")
  console.log("✅ authRoutes importado correctamente")

  const categoriaRoutes = await import("../src/routes/categoriaRoutes.js")
  console.log("✅ categoriaRoutes importado correctamente")

  const viajeRoutes = await import("../src/routes/viajeRoutes.js")
  console.log("✅ viajeRoutes importado correctamente")

  const reservaRoutes = await import("../src/routes/reservaRoutes.js")
  console.log("✅ reservaRoutes importado correctamente")

  const adminRoutes = await import("../src/routes/adminRoutes.js")
  console.log("✅ adminRoutes importado correctamente")

  // Crear app de prueba
  console.log("🚀 Creando app de prueba...")
  const app = express()

  // Registrar rutas una por una para identificar cuál falla
  console.log("📝 Registrando rutas...")

  app.use("/api/auth", authRoutes.default)
  console.log("✅ Rutas auth registradas")

  app.use("/api/categorias", categoriaRoutes.default)
  console.log("✅ Rutas categorias registradas")

  app.use("/api/viajes", viajeRoutes.default)
  console.log("✅ Rutas viajes registradas")

  app.use("/api/reservas", reservaRoutes.default)
  console.log("✅ Rutas reservas registradas")

  app.use("/api/admin", adminRoutes.default)
  console.log("✅ Rutas admin registradas")

  console.log("🎉 Todas las rutas se registraron correctamente")
  console.log("El problema podría estar en otro lugar...")
} catch (error) {
  console.error("❌ Error encontrado:", error.message)
  console.error("📍 Stack trace:", error.stack)
}
