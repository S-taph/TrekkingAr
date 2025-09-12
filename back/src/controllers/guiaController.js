import { validationResult } from "express-validator"
import { Op } from "sequelize"
import Guia from "../models/Guia.js"
import Usuario from "../models/Usuario.js"
import GuiaViaje from "../models/GuiaViaje.js"
import FechaViaje from "../models/FechaViaje.js"
import Viaje from "../models/Viaje.js"

export const getAllGuias = async (req, res) => {
  try {
    console.log("[v0] Parámetros recibidos en getAllGuias:", req.query)

    const { disponible, activo, especialidad, search, page = 1, limit = 10 } = req.query

    const whereClause = {}

    if (disponible !== undefined && disponible !== "") {
      whereClause.disponible = disponible === "true"
    }
    if (activo !== undefined && activo !== "") {
      whereClause.activo = activo === "true"
    }

    if (especialidad) {
      whereClause.especialidades = { [Op.like]: `%${especialidad}%` }
    }

    const includeClause = {
      model: Usuario,
      as: "usuario",
      attributes: ["id_usuarios", "nombre", "apellido", "email", "telefono"],
    }

    if (search) {
      includeClause.where = {
        [Op.or]: [{ nombre: { [Op.like]: `%${search}%` } }, { apellido: { [Op.like]: `%${search}%` } }],
      }
    }

    const offset = (page - 1) * limit

    console.log("[v0] Consulta con whereClause:", whereClause)
    console.log("[v0] Include clause:", includeClause)

    const { count, rows: guias } = await Guia.findAndCountAll({
      where: whereClause,
      include: [includeClause],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["calificacion_promedio", "DESC"]],
    })

    console.log("[v0] Guías encontrados:", count)
    console.log("[v0] Primeros guías:", guias.slice(0, 2))

    res.json({
      success: true,
      data: {
        guias,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("[v0] Error al obtener guías:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const getGuiaById = async (req, res) => {
  try {
    const { id } = req.params

    const guia = await Guia.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email", "telefono"],
        },
        {
          model: GuiaViaje,
          as: "asignaciones",
          include: [
            {
              model: FechaViaje,
              as: "fechaViaje",
              include: [
                {
                  model: Viaje,
                  as: "viaje",
                  attributes: ["id_viaje", "titulo", "dificultad"],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!guia) {
      return res.status(404).json({
        success: false,
        message: "Guía no encontrado",
      })
    }

    res.json({
      success: true,
      data: { guia },
    })
  } catch (error) {
    console.error("Error al obtener guía:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const createGuia = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      })
    }

    const guiaData = req.body

    console.log("[v0] Datos recibidos para crear guía:", guiaData)

    // Verificar que el usuario existe y tiene rol de guía
    const usuario = await Usuario.findByPk(guiaData.id_usuario)
    if (!usuario) {
      console.log("[v0] Usuario no encontrado:", guiaData.id_usuario)
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    console.log("[v0] Usuario encontrado:", { id: usuario.id_usuarios, rol: usuario.rol })

    if (process.env.NODE_ENV !== "development" && usuario.rol !== "guia") {
      return res.status(400).json({
        success: false,
        message: "El usuario debe tener rol de guía",
      })
    }

    // Verificar que no existe ya un perfil de guía para este usuario
    const guiaExistente = await Guia.findOne({
      where: { id_usuario: guiaData.id_usuario },
    })

    if (guiaExistente) {
      console.log("[v0] Ya existe guía para usuario:", guiaData.id_usuario)
      return res.status(400).json({
        success: false,
        message: "Ya existe un perfil de guía para este usuario",
      })
    }

    console.log("[v0] Creando guía con datos:", guiaData)
    const guia = await Guia.create(guiaData)
    console.log("[v0] Guía creado:", guia.toJSON())

    const guiaCompleto = await Guia.findByPk(guia.id_guia, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email"],
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: "Perfil de guía creado exitosamente",
      data: { guia: guiaCompleto },
    })
  } catch (error) {
    console.error("[v0] Error al crear guía:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const updateGuia = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const updateData = req.body

    const guia = await Guia.findByPk(id)
    if (!guia) {
      return res.status(404).json({
        success: false,
        message: "Guía no encontrado",
      })
    }

    await guia.update(updateData)

    const guiaActualizado = await Guia.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email"],
        },
      ],
    })

    res.json({
      success: true,
      message: "Perfil de guía actualizado exitosamente",
      data: { guia: guiaActualizado },
    })
  } catch (error) {
    console.error("Error al actualizar guía:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const asignarGuiaAViaje = async (req, res) => {
  try {
    const { id_guia, id_fecha_viaje, rol_guia = "principal", tarifa_acordada, observaciones } = req.body

    // Verificar que el guía existe
    const guia = await Guia.findByPk(id_guia)
    if (!guia) {
      return res.status(404).json({
        success: false,
        message: "Guía no encontrado",
      })
    }

    // Verificar que la fecha del viaje existe
    const fechaViaje = await FechaViaje.findByPk(id_fecha_viaje)
    if (!fechaViaje) {
      return res.status(404).json({
        success: false,
        message: "Fecha de viaje no encontrada",
      })
    }

    // Verificar que no esté ya asignado
    const asignacionExistente = await GuiaViaje.findOne({
      where: {
        id_guia,
        id_fecha_viaje,
      },
    })

    if (asignacionExistente) {
      return res.status(400).json({
        success: false,
        message: "El guía ya está asignado a esta fecha de viaje",
      })
    }

    const asignacion = await GuiaViaje.create({
      id_guia,
      id_fecha_viaje,
      rol_guia,
      tarifa_acordada,
      observaciones,
    })

    const asignacionCompleta = await GuiaViaje.findByPk(asignacion.id_guia_viaje, {
      include: [
        {
          model: Guia,
          as: "guia",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["nombre", "apellido", "email"],
            },
          ],
        },
        {
          model: FechaViaje,
          as: "fechaViaje",
          include: [
            {
              model: Viaje,
              as: "viaje",
              attributes: ["titulo", "dificultad"],
            },
          ],
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: "Guía asignado exitosamente",
      data: { asignacion: asignacionCompleta },
    })
  } catch (error) {
    console.error("Error al asignar guía:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}
