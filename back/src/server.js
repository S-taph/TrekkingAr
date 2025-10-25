import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import { createServer } from "http"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"

// Importar rutas
import authRoutes from "./routes/authRoutes.js"
import categoriaRoutes from "./routes/categoriaRoutes.js"
import viajeRoutes from "./routes/viajeRoutes.js"
import reservaRoutes from "./routes/reservaRoutes.js"
import guiaRoutes from "./routes/guiaRoutes.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import carritoRoutes from "./routes/carritoRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"

// Importar configuración de BD y modelos
import sequelize from "./config/database.js"
import "./models/associations.js"
import seedDatabase from "../scripts/seedDatabase.js"
import { configurePassportGoogle } from "./config/passport.js"

// Cargar variables de entorno
dotenv.config()

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3000

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  },
  path: process.env.SOCKET_IO_PATH || "/socket.io"
})

// Middleware de autenticación para Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return next(new Error('Token de autenticación requerido'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Importar Usuario aquí para evitar dependencias circulares
    const { Usuario } = await import('./models/associations.js');
    const user = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user || !user.activo) {
      return next(new Error('Usuario inválido o inactivo'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Error autenticando socket:', error);
    next(new Error('Token inválido'));
  }
});

// Configurar namespaces de Socket.IO
const adminNamespace = io.of('/admin');

// Aplicar middleware de autenticación también al namespace admin
adminNamespace.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];

    if (!token) {
      return next(new Error('Token de autenticación requerido'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { Usuario } = await import('./models/associations.js');
    const user = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user || !user.activo) {
      return next(new Error('Usuario inválido o inactivo'));
    }

    // Verificar que el usuario sea admin
    if (user.rol !== 'admin') {
      return next(new Error('Acceso denegado: se requiere rol de administrador'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Error autenticando socket admin:', error);
    next(new Error('Token inválido'));
  }
});

adminNamespace.on('connection', (socket) => {
  console.log(`Admin conectado: ${socket.user?.email || 'desconocido'} (${socket.id})`);

  // Unir al usuario al room de administradores
  socket.join('admin');

  socket.on('disconnect', () => {
    console.log(`Admin desconectado: ${socket.user?.email || 'desconocido'}`);
  });
});

// Hacer io disponible en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Permitir envío de cookies
  }),
) // CORS
app.use(limiter) // Rate limiting
app.use(cookieParser()) // Agregando middleware de cookie-parser

// Configurar express-session para Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  }
}))

app.use(express.json({ limit: "10mb" })) // Parse JSON
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded

// Serve static uploads
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Servir uploads con headers que permitan cross-origin
app.use('/uploads', (req, res, next) => {
  // Permitir uso cruzado de imágenes
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

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
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/carrito", carritoRoutes)
app.use("/api/reviews", reviewRoutes) // IMPORTANTE: Debe ir ANTES de contactRoutes
app.use("/api", contactRoutes) // Este aplica middleware global, debe ir al final

// Configure Passport Google (después de las rutas para evitar conflictos)
configurePassportGoogle(app)

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
      try {
        await sequelize.sync({ alter: false }) // No forzar recreación
        console.log("✅ Modelos sincronizados")
      } catch (error) {
        console.warn("⚠️  Advertencia: No se pudieron sincronizar todos los modelos:", error.message)
        console.log("💡 Ejecuta las migraciones manualmente: npx sequelize-cli db:migrate")
      }
    }

    await seedDatabase()

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
      console.log(`📡 API disponible en http://localhost:${PORT}`)
      console.log(`🔌 Socket.IO disponible en http://localhost:${PORT}/socket.io`)
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
