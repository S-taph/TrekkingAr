import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

export const authenticateToken = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" && req.headers["x-bypass-auth"] === "true") {
      // Usuario mock de admin para desarrollo
      req.user = {
        id_usuarios: 1,
        rol: "admin",
        nombre: "Admin",
        apellido: "Test",
        email: "admin@test.com",
        activo: true,
      }
      return next()
    }

    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
    })

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o usuario inactivo",
      })
    }

    req.user = usuario
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token inválido",
    })
  }
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      })
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para acceder a este recurso",
      })
    }

    next()
  }
}
