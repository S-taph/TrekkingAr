import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
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

    const { email, password, nombre, apellido, telefono, experiencia_previa } = req.body

    // Verificar si ya existe el usuario
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      })
    }

    // Hash de la contraseña - 12 rounds es suficiente
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
      rol: "cliente", // por defecto siempre cliente
    })

    const token = generateToken(usuario.id_usuarios)

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
        token,
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
        token,
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

// TODO: agregar endpoint para cambiar password
// TODO: agregar endpoint para actualizar perfil
// TODO: implementar refresh tokens
