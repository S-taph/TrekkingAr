// Carrito Controller: handles persistent cart operations per user
import { validationResult } from "express-validator"
import Carrito from "../models/Carrito.js"
import CarritoItem from "../models/CarritoItem.js"
import FechaViaje from "../models/FechaViaje.js"
import Viaje from "../models/Viaje.js"

export const getCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({
      where: { id_usuario: req.user.id_usuarios, activo: true },
      include: [{
        model: CarritoItem,
        as: "items",
        include: [{ model: FechaViaje, as: "fechaViaje", include: [{ model: Viaje, as: "viaje" }] }],
      }],
    })

    if (!carrito) {
      carrito = await Carrito.create({ id_usuario: req.user.id_usuarios, activo: true, cantidad_personas: 1 })
    }

    return res.json({ success: true, data: { carrito } })
  } catch (error) {
    console.error("Error getCarrito:", error)
    return res.status(500).json({ success: false, message: "Error interno del servidor" })
  }
}

export const addItem = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Datos inválidos", errors: errors.array() })
    }

    const { id_fecha_viaje, cantidad } = req.body

    // Ensure cart exists
    let carrito = await Carrito.findOne({ where: { id_usuario: req.user.id_usuarios, activo: true } })
    if (!carrito) carrito = await Carrito.create({ id_usuario: req.user.id_usuarios, activo: true })

    // Validate fecha
    const fecha = await FechaViaje.findByPk(id_fecha_viaje, { include: [{ model: Viaje, as: "viaje" }] })
    if (!fecha) return res.status(404).json({ success: false, message: "Fecha de viaje no encontrada" })

    // Determine unit price (fecha.precio_fecha or viaje.precio_base)
    const precio_unitario = Number.parseFloat(fecha.precio_fecha ?? fecha.viaje?.precio_base ?? 0)

    // Upsert: if existing item for same fecha
    const existing = await CarritoItem.findOne({ where: { id_carrito: carrito.id_carrito, id_fecha_viaje } })
    if (existing) {
      await existing.update({ cantidad: existing.cantidad + cantidad })
      return res.status(200).json({ success: true, message: "Cantidad actualizada", data: { item: existing } })
    }

    const item = await CarritoItem.create({ id_carrito: carrito.id_carrito, id_fecha_viaje, cantidad, precio_unitario })

    return res.status(201).json({ success: true, message: "Ítem agregado al carrito", data: { item } })
  } catch (error) {
    console.error("Error addItem:", error)
    return res.status(500).json({ success: false, message: "Error interno del servidor" })
  }
}

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const item = await CarritoItem.findByPk(id)
    if (!item) return res.status(404).json({ success: false, message: "Ítem no encontrado" })

    await item.update({ cantidad })
    return res.json({ success: true, message: "Ítem actualizado", data: { item } })
  } catch (error) {
    console.error("Error updateItem:", error)
    return res.status(500).json({ success: false, message: "Error interno del servidor" })
  }
}

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const item = await CarritoItem.findByPk(id)
    if (!item) return res.status(404).json({ success: false, message: "Ítem no encontrado" })

    await item.destroy()
    return res.json({ success: true, message: "Ítem eliminado" })
  } catch (error) {
    console.error("Error deleteItem:", error)
    return res.status(500).json({ success: false, message: "Error interno del servidor" })
  }
}

export const checkout = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ where: { id_usuario: req.user.id_usuarios, activo: true }, include: [{ model: CarritoItem, as: "items" }] })
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      return res.status(400).json({ success: false, message: "El carrito está vacío" })
    }

    // Placeholder: compute total
    const total = carrito.items.reduce((acc, it) => acc + Number(it.precio_unitario) * it.cantidad, 0)

    // Mark cart inactive to simulate checkout
    await carrito.update({ activo: false })

    return res.json({ success: true, message: "Checkout realizado (placeholder)", data: { total, carritoId: carrito.id_carrito } })
  } catch (error) {
    console.error("Error checkout:", error)
    return res.status(500).json({ success: false, message: "Error interno del servidor" })
  }
}
