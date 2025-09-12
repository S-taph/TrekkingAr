import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"

// Importar rutas
import authRoutes from "./routes/authRoutes.js"
import categoriaRoutes from "./routes/categoriaRoutes.js"
import viajeRoutes from "./routes/viajeRoutes.js"
import reservaRoutes from "./routes/reservaRoutes.js"
import guiaRoutes from "./routes/guiaRoutes.js"

// Importar configuración de BD y modelos
import sequelize from "./config/database.js"
import "./models/associations.js"

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: "Demasiadas solicitudes, intenta de nuevo más tarde",
  },
})

// Middlewares globales
app.use(helmet()) // Headers de seguridad
app.use(cors()) // CORS
app.use(limiter) // Rate limiting
app.use(express.json({ limit: "10mb" })) // Parse JSON
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded

// Middleware de logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas principales
app.use("/api/auth", authRoutes)
app.use("/api/categorias", categoriaRoutes)
app.use("/api/viajes", viajeRoutes)
app.use("/api/reservas", reservaRoutes)
app.use("/api/guias", guiaRoutes)

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "🏔️ TrekkingAR API",
    version: "1.0.0",
    docs: "/api/health",
  })
})

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.originalUrl,
  })
})

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente")

    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false }) // No forzar recreación
      console.log("✅ Modelos sincronizados")
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
      console.log(`📡 API disponible en http://localhost:${PORT}`)
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

// Manejo de errores no capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  process.exit(1)
})

// Iniciar el servidor
startServer()

export default app
