import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import passport from "passport"
import Usuario from "../models/Usuario.js"

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

    // Crear usuario
    const usuario = await Usuario.create({
      email,
      password_hash,
      nombre,
      apellido,
      telefono,
      experiencia_previa,
      dni,
      rol: "cliente", // por defecto siempre cliente
    })

    const token = generateToken(usuario.id_usuarios)

    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Protección CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    })

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
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
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      })
    }

    // Verificar si está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada. Contacta al administrador.",
      })
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, usuario.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      })
    }

    const token = generateToken(usuario.id_usuarios)

    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Protección CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    })

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
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
      const token = generateToken(user.id_usuarios);

      // Configurar cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      // Redirigir al frontend con éxito
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?login=success`);
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

// TODO: agregar endpoint para cambiar password
// TODO: agregar endpoint para actualizar perfil
// TODO: implementar refresh tokens
