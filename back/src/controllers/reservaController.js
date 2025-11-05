import { validationResult } from "express-validator"
import { Op } from "sequelize"
import Reserva from "../models/Reserva.js"
import Compra from "../models/Compra.js"
import Usuario from "../models/Usuario.js"
import FechaViaje from "../models/FechaViaje.js"
import Viaje from "../models/Viaje.js"
import sequelize from "../config/database.js"

// Función para generar número de reserva único
const generateReservaNumber = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `RES-${timestamp.slice(-6)}${random}`
}

export const createReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      await transaction.rollback()
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const { id_fecha_viaje, cantidad_personas, observaciones_reserva } = req.body
    const id_usuario = req.user.id_usuarios

    // Verificar que la fecha del viaje existe y está disponible
    const fechaViaje = await FechaViaje.findByPk(id_fecha_viaje, {
      include: [
        {
          model: Viaje,
          as: "viaje",
          attributes: ["precio_base", "titulo"],
        },
      ],
    })

    if (!fechaViaje) {
      await transaction.rollback()
      return res.status(404).json({
        success: false,
        message: "Fecha de viaje no encontrada",
      })
    }

    // Verificar cupos disponibles
    const cuposDisponibles = fechaViaje.cupos_totales - fechaViaje.cupos_ocupados
    if (cuposDisponibles < cantidad_personas) {
      await transaction.rollback()
      return res.status(400).json({
        success: false,
        message: `No hay cupos suficientes. Disponibles: ${cuposDisponibles}`,
      })
    }

    // Obtener el precio: usar precio_fecha si existe, sino precio_base del viaje
    const precio_unitario = fechaViaje.precio_fecha || fechaViaje.viaje.precio_base
    const subtotal_reserva = precio_unitario * cantidad_personas

    // Crear compra primero
    const compra = await Compra.create(
      {
        numero_compra: `COMP-${Date.now()}`,
        id_usuario,
        total_compra: subtotal_reserva,
        estado_compra: "pendiente",
      },
      { transaction },
    )

    // Crear la reserva
    const reserva = await Reserva.create(
      {
        numero_reserva: generateReservaNumber(),
        id_compra: compra.id_compras,
        id_usuario,
        id_fecha_viaje,
        cantidad_personas,
        precio_unitario,
        subtotal_reserva,
        estado_reserva: "pendiente",
        observaciones_reserva,
      },
      { transaction },
    )

    await transaction.commit()

    // Obtener reserva completa con relaciones
    const reservaCompleta = await Reserva.findByPk(reserva.id_reserva, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email"],
        },
        {
          model: Compra,
          as: "compra",
          attributes: ["id_compras", "numero_compra", "total_compra", "estado_compra"],
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: { reserva: reservaCompleta },
    })
  } catch (error) {
    await transaction.rollback()
    console.error("Error al crear reserva:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const getReservasByUser = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuarios
    const { estado, page = 1, limit = 10 } = req.query

    const whereClause = { id_usuario }
    if (estado) whereClause.estado_reserva = estado

    const offset = (page - 1) * limit

    const { count, rows: reservas } = await Reserva.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Compra,
          as: "compra",
          attributes: ["id_compras", "numero_compra", "total_compra", "estado_compra"],
        },
        {
          model: FechaViaje,
          as: "fecha_viaje",
          include: [
            {
              model: Viaje,
              as: "viaje",
            },
          ],
        },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["fecha_reserva", "DESC"]], // las más recientes primero
    })

    res.json({
      success: true,
      data: {
        reservas,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener reservas del usuario:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const getAllReservas = async (req, res) => {
  try {
    const { estado, fecha_desde, fecha_hasta, page = 1, limit = 10 } = req.query

    const whereClause = {}
    if (estado) whereClause.estado_reserva = estado

    // Filtros por fecha
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha_reserva = {}
      if (fecha_desde) whereClause.fecha_reserva[Op.gte] = new Date(fecha_desde)
      if (fecha_hasta) whereClause.fecha_reserva[Op.lte] = new Date(fecha_hasta)
    }

    const offset = (page - 1) * limit

    const { count, rows: reservas } = await Reserva.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email", "telefono"],
        },
        {
          model: Compra,
          as: "compra",
          attributes: ["id_compras", "numero_compra", "total_compra", "estado_compra"],
        },
        {
          model: FechaViaje,
          as: "fecha_viaje",
          include: [
            {
              model: Viaje,
              as: "viaje",
              attributes: ["id_viaje", "titulo", "descripcion_corta", "duracion_dias", "dificultad"],
            },
          ],
        },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["fecha_reserva", "DESC"]],
    })

    res.json({
      success: true,
      data: {
        reservas,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener todas las reservas:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const updateReservaStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { estado_reserva, observaciones_reserva } = req.body

    const reserva = await Reserva.findByPk(id)
    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      })
    }

    // Validar transiciones de estado válidas
    const estadosValidos = ["pendiente", "confirmada", "en_progreso", "completada", "cancelada"]
    if (!estadosValidos.includes(estado_reserva)) {
      return res.status(400).json({
        success: false,
        message: "Estado de reserva inválido",
      })
    }

    await reserva.update({
      estado_reserva,
      ...(observaciones_reserva && { observaciones_reserva }),
    })

    const reservaActualizada = await Reserva.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuarios", "nombre", "apellido", "email"],
        },
        {
          model: Compra,
          as: "compra",
          attributes: ["id_compras", "numero_compra", "estado_compra"],
        },
      ],
    })

    res.json({
      success: true,
      message: "Estado de reserva actualizado exitosamente",
      data: { reserva: reservaActualizada },
    })
  } catch (error) {
    console.error("Error al actualizar estado de reserva:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const cancelReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params
    const id_usuario = req.user.id_usuarios

    const reserva = await Reserva.findOne({
      where: {
        id_reserva: id,
        id_usuario, // Solo el usuario propietario puede cancelar
      },
      include: [
        {
          model: Compra,
          as: "compra",
        },
      ],
    })

    if (!reserva) {
      await transaction.rollback()
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada o no tienes permisos para cancelarla",
      })
    }

    if (reserva.estado_reserva === "cancelada") {
      await transaction.rollback()
      return res.status(400).json({
        success: false,
        message: "La reserva ya está cancelada",
      })
    }

    if (reserva.estado_reserva === "completada") {
      await transaction.rollback()
      return res.status(400).json({
        success: false,
        message: "No se puede cancelar una reserva completada",
      })
    }

    // Actualizar reserva y compra
    await reserva.update({ estado_reserva: "cancelada" }, { transaction })
    await reserva.compra.update({ estado_compra: "cancelada" }, { transaction })

    await transaction.commit()

    res.json({
      success: true,
      message: "Reserva cancelada exitosamente",
    })
  } catch (error) {
    await transaction.rollback()
    console.error("Error al cancelar reserva:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

// TODO: agregar endpoint para obtener reserva por ID
// TODO: implementar sistema de reembolsos
// TODO: agregar validación de fechas de cancelación
