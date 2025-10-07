import { validationResult } from "express-validator"
import { Op } from "sequelize"
import Viaje from "../models/Viaje.js"
import Categoria from "../models/Categoria.js"

export const getAllViajes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      dificultad,
      precio_min,
      precio_max,
      duracion_min,
      duracion_max,
      search,
      activo = true,
    } = req.query

    const offset = (page - 1) * limit
    const whereClause = {}

    // Filtros básicos
    if (activo !== undefined) whereClause.activo = activo === "true"
    if (categoria) whereClause.id_categoria = categoria
    if (dificultad) whereClause.dificultad = dificultad

    // Filtros de precio
    if (precio_min || precio_max) {
      whereClause.precio_base = {}
      if (precio_min) whereClause.precio_base[Op.gte] = precio_min
      if (precio_max) whereClause.precio_base[Op.lte] = precio_max
    }

    // Filtros de duración
    if (duracion_min || duracion_max) {
      whereClause.duracion_dias = {}
      if (duracion_min) whereClause.duracion_dias[Op.gte] = duracion_min
      if (duracion_max) whereClause.duracion_dias[Op.lte] = duracion_max
    }

    // Búsqueda por texto - busca en título y descripción
    if (search) {
      whereClause[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { descripcion_corta: { [Op.like]: `%${search}%` } },
      ]
    }

    const { count, rows: viajes } = await Viaje.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre"],
        },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["fecha_creacion", "DESC"]], // los más nuevos primero
    })

    res.json({
      success: true,
      data: {
        viajes,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener viajes:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const getViajeById = async (req, res) => {
  try {
    const { id } = req.params

    const viaje = await Viaje.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre", "descripcion"],
        },
      ],
    })

    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: "Viaje no encontrado",
      })
    }

    res.json({
      success: true,
      data: { viaje },
    })
  } catch (error) {
    console.error("Error al obtener viaje:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const createViaje = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const viajeData = req.body

    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(viajeData.id_categoria)
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: "Categoría no encontrada",
      })
    }

    const viaje = await Viaje.create(viajeData)

    // Obtener el viaje completo con la categoría
    const viajeCompleto = await Viaje.findByPk(viaje.id_viaje, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre"],
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: "Viaje creado exitosamente",
      data: { viaje: viajeCompleto },
    })
  } catch (error) {
    console.error("Error al crear viaje:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const updateViaje = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const updateData = req.body

    const viaje = await Viaje.findByPk(id)
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: "Viaje no encontrado",
      })
    }

    // Si se actualiza la categoría, verificar que existe
    if (updateData.id_categoria) {
      const categoria = await Categoria.findByPk(updateData.id_categoria)
      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: "Categoría no encontrada",
        })
      }
    }

    await viaje.update(updateData)

    const viajeActualizado = await Viaje.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre"],
        },
      ],
    })

    res.json({
      success: true,
      message: "Viaje actualizado exitosamente",
      data: { viaje: viajeActualizado },
    })
  } catch (error) {
    console.error("Error al actualizar viaje:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const deleteViaje = async (req, res) => {
  try {
    const { id } = req.params

    const viaje = await Viaje.findByPk(id)
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: "Viaje no encontrado",
      })
    }

    // Soft delete - solo marcamos como inactivo
    await viaje.update({ activo: false })

    res.json({
      success: true,
      message: "Viaje desactivado exitosamente",
    })
  } catch (error) {
    console.error("Error al eliminar viaje:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const getViajesByCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params
    const { limit = 10 } = req.query

    const viajes = await Viaje.findAll({
      where: {
        id_categoria: categoriaId,
        activo: true,
      },
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre"],
        },
      ],
      limit: Number.parseInt(limit),
      order: [["fecha_creacion", "DESC"]],
    })

    res.json({
      success: true,
      data: { viajes },
    })
  } catch (error) {
    console.error("Error al obtener viajes por categoría:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

// TODO: agregar endpoint para obtener viajes populares
// TODO: implementar sistema de ratings
// TODO: agregar filtro por fechas disponibles
