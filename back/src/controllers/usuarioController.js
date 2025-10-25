import { Usuario } from "../models/associations.js"
import { Op } from "sequelize"

const getUsuarios = async (req, res) => {
  try {
    console.log("[v0] getUsuarios called with query:", req.query)

    const { search, rol, limit = 50 } = req.query
    const whereClause = { activo: true }

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { apellido: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { dni: { [Op.like]: `%${search}%` } },
      ]
    }

    if (rol) {
      whereClause.rol = rol
    }

    const usuarios = await Usuario.findAll({
      where: whereClause,
      attributes: ["id_usuarios", "nombre", "apellido", "email", "dni", "rol"],
      limit: Number.parseInt(limit),
      order: [
        ["apellido", "ASC"],
        ["nombre", "ASC"],
      ],
    })

    console.log("[v0] Found usuarios:", usuarios.length)

    // Return the array directly to match frontend expectations
    res.json(usuarios)
  } catch (error) {
    console.error("[v0] Error in getUsuarios:", error)
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    })
  }
}

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id, {
      attributes: ["id_usuarios", "nombre", "apellido", "email", "dni", "rol", "activo"],
    })

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json(usuario)
  } catch (error) {
    console.error("Error in getUsuarioById:", error)
    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    })
  }
}

/**
 * Actualiza un usuario
 * ✅ Conectado con frontend
 */
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, email, telefono, dni, rol, activo } = req.body

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }

    // Actualizar solo los campos proporcionados
    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      telefono: telefono !== undefined ? telefono : usuario.telefono,
      dni: dni !== undefined ? dni : usuario.dni,
      rol: rol || usuario.rol,
      activo: activo !== undefined ? activo : usuario.activo
    })

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: { usuario }
    })

  } catch (error) {
    console.error("Error actualizando usuario:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    })
  }
}

/**
 * Sube avatar de usuario
 * ✅ Conectado con frontend
 */
const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se subió ningún archivo"
      })
    }

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }

    // Construir URL del avatar
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`

    await usuario.update({
      avatar_url: avatarUrl
    })

    res.json({
      success: true,
      message: "Avatar actualizado exitosamente",
      data: {
        avatarUrl
      }
    })

  } catch (error) {
    console.error("Error subiendo avatar:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    })
  }
}

export { getUsuarios, getUsuarioById, updateUsuario, uploadAvatar }
