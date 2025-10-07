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

export { getUsuarios, getUsuarioById }
