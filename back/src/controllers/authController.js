import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import passport from "passport"
import { v4 as uuidv4 } from "uuid"
import Usuario from "../models/Usuario.js"
import emailService from "../services/emailService.js"
import auditService from "../services/auditService.js"
import roleService from "../services/roleService.js"

// TODO: mover esto a un archivo de utils
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // fallback por si no está en .env
  })
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const { email, password, nombre, apellido, telefono, experiencia_previa, dni } = req.body

    // Verificar si ya existe el usuario
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      })
    }

    // Hash de la contraseña - 12 rounds
    const saltRounds = 12
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Generar token de verificación
    const verificationToken = uuidv4()
    const tokenExpiry = new Date()
    tokenExpiry.setHours(tokenExpiry.getHours() + 24) // Expira en 24 horas

    // Crear usuario
    const usuario = await Usuario.create({
      email,
      password_hash,
      nombre,
      apellido,
      telefono,
      experiencia_previa,
      dni,
      rol: "cliente", // por defecto siempre cliente (mantenido para retrocompatibilidad)
      is_verified: false,
      verification_token: verificationToken,
      token_expiry: tokenExpiry,
    })

    // Asignar rol de cliente en el nuevo sistema
    await roleService.setupInitialRoles(usuario.id_usuarios, "cliente")

    // Enviar correo de verificación
    try {
      const emailResult = await emailService.sendVerificationEmail(email, verificationToken, nombre)
      console.log('[Auth] ✅ Verification email sent successfully to:', email)
      console.log('[Auth] Email service response:', emailResult)
    } catch (emailError) {
      console.error('[Auth] ❌ CRITICAL: Error sending verification email:', emailError)
      console.error('[Auth] Email error details:', {
        email,
        errorMessage: emailError.message,
        errorStack: emailError.stack
      })
      // No bloqueamos el registro si falla el email, pero registramos el error claramente
    }

    const token = generateToken(usuario.id_usuarios)

    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.BACKEND_URL?.startsWith('https') || process.env.NODE_ENV === "production", // HTTPS en producción o con ngrok
      sameSite: "lax", // Permite cookies en navegación de sitios cruzados (necesario para localhost -> ngrok)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    })

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente. Por favor verifica tu correo electrónico.",
      data: {
        token, // Incluir token en respuesta para uso del frontend
        user: {
          id: usuario.id_usuarios,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          is_verified: usuario.is_verified,
        },
      },
    })
  } catch (error) {
    console.error("Error en registro:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
      // Registrar intento fallido
      await auditService.logFailedLogin(email, req, "Usuario no encontrado")
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      })
    }

    // Verificar si está activo
    if (!usuario.activo) {
      await auditService.logFailedLogin(email, req, "Cuenta desactivada")
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada. Contacta al administrador.",
      })
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, usuario.password_hash)
    if (!isValidPassword) {
      // Registrar intento fallido
      await auditService.logFailedLogin(email, req, "Contraseña incorrecta")
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      })
    }

    // Registrar login exitoso en auditoría
    await auditService.logLogin(usuario, req, "tradicional")

    const token = generateToken(usuario.id_usuarios)

    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.BACKEND_URL?.startsWith('https') || process.env.NODE_ENV === "production", // HTTPS en producción o con ngrok
      sameSite: "lax", // Permite cookies en navegación de sitios cruzados (necesario para localhost -> ngrok)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    })

    // Log adicional para administradores
    if (usuario.rol === 'admin') {
      console.log(`[SECURITY] 🔐 Admin login: ${usuario.email} from IP: ${auditService.getClientIp(req)}`)
    }

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        token, // Incluir token en respuesta para uso del frontend
        user: {
          id: usuario.id_usuarios,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
        },
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    // El usuario ya viene del middleware de auth
    const usuario = await Usuario.findByPk(req.user.id_usuarios, {
      attributes: { exclude: ["password_hash"] }, // nunca devolver el hash
    })

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    res.json({
      success: true,
      data: { user: usuario },
    })
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const logout = async (req, res) => {
  try {
    // Registrar logout en auditoría si hay usuario autenticado
    if (req.user) {
      await auditService.logLogout(req.user, req)
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.json({
      success: true,
      message: "Logout exitoso",
    })
  } catch (error) {
    console.error("Error en logout:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

/**
 * Inicia el flujo de autenticación con Google OAuth
 */
export const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

/**
 * Callback de Google OAuth
 */
export const googleCallback = async (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.error('Error en Google OAuth:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
    }

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      // Registrar login OAuth en auditoría
      await auditService.logLogin(user, req, "oauth")

      // Log adicional para administradores
      if (user.rol === 'admin') {
        console.log(`[SECURITY] 🔐 Admin OAuth login: ${user.email} from IP: ${auditService.getClientIp(req)}`)
      }

      const token = generateToken(user.id_usuarios);

      // Verificar si estamos en modo cross-origin (ngrok backend + localhost frontend)
      const isCrossOrigin = () => {
        try {
          const backendUrl = new URL(process.env.BACKEND_URL || 'http://localhost:3003')
          const frontendUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:5173')
          return backendUrl.origin !== frontendUrl.origin
        } catch {
          return false
        }
      }

      // Configurar cookie (solo funciona si frontend y backend están en el mismo dominio)
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.BACKEND_URL?.startsWith('https') || process.env.NODE_ENV === "production", // HTTPS en producción o con ngrok
        sameSite: "lax", // Permite cookies en navegación de sitios cruzados (necesario para localhost -> ngrok)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      // Redirigir al frontend según el rol del usuario
      let redirectUrl = user.rol === 'admin'
        ? `${process.env.FRONTEND_URL}/admin?login=success`
        : `${process.env.FRONTEND_URL}/?login=success`;

      // Si estamos en cross-origin (ej: ngrok backend + localhost frontend),
      // pasar el token en la URL para que el frontend lo guarde en localStorage
      if (isCrossOrigin()) {
        console.log('[OAuth] Modo cross-origin detectado, pasando token en URL')
        redirectUrl += `&token=${token}`
      }

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error generando token:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  })(req, res, next);
};

/**
 * Obtiene el perfil del usuario autenticado (alias de getProfile)
 */
export const getMe = getProfile;

/**
 * Verificar correo electrónico
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token de verificación no proporcionado",
      })
    }

    // Buscar usuario con el token
    const usuario = await Usuario.findOne({
      where: { verification_token: token }
    })

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Token de verificación inválido",
      })
    }

    // Verificar si el token expiró
    if (new Date() > new Date(usuario.token_expiry)) {
      return res.status(400).json({
        success: false,
        message: "El token de verificación ha expirado. Por favor solicita uno nuevo.",
      })
    }

    // Verificar el usuario
    await usuario.update({
      is_verified: true,
      verification_token: null,
      token_expiry: null,
    })

    console.log('[Auth] Email verified for user:', usuario.email)

    res.json({
      success: true,
      message: "¡Correo verificado exitosamente! Ya puedes acceder a todas las funciones.",
      data: {
        user: {
          id: usuario.id_usuarios,
          email: usuario.email,
          nombre: usuario.nombre,
          is_verified: true,
        }
      }
    })
  } catch (error) {
    console.error('[Auth] Error verifying email:', error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

// TODO: agregar endpoint para cambiar password
// TODO: agregar endpoint para actualizar perfil
// TODO: implementar refresh tokens
// TODO: agregar endpoint para reenviar email de verificación
