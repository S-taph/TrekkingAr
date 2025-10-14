// Contacto y Notificaciones controller
import { body, validationResult } from 'express-validator'
import MensajeContacto from '../models/MensajeContacto.js'
import AdminNotificacion from '../models/AdminNotificacion.js'
import { sendAdminNotificationEmail, sendReplyToUser } from '../utils/mailer.js'

export const contactValidation = [
  body('nombre').isLength({ min: 2 }),
  body('email').isEmail(),
  body('asunto').isLength({ min: 3 }),
  body('mensaje').isLength({ min: 5 }),
]

export const crearContacto = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() })

    const { nombre, email, asunto, mensaje } = req.body
    const msg = await MensajeContacto.create({ nombre, email, asunto, mensaje })

    const notif = await AdminNotificacion.create({ tipo: 'contact_form', leido: false, meta: { contactoId: msg.id }, mensaje: `${nombre} (${email}): ${asunto}`, from_email: email })

    // Emitir socket si io está disponible en app locals
    req.app?.get('io_admin')?.emit('new:notification', { id: notif.id, tipo: notif.tipo, mensaje: notif.mensaje })

    // Email a admins
    await sendAdminNotificationEmail({ subject: `[Nuevo contacto] ${asunto}`, html: `<p><b>Nombre:</b> ${nombre}</p><p><b>Email:</b> ${email}</p><p><b>Mensaje:</b><br/>${mensaje}</p>` })

    return res.status(201).json({ success: true, message: 'Contacto enviado', data: { id: msg.id } })
  } catch (e) {
    console.error('crearContacto error', e)
    return res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export const listarNotificaciones = async (req, res) => {
  try {
    const { leido } = req.query
    const where = {}
    if (leido !== undefined) where.leido = leido === 'true'
    const notifs = await AdminNotificacion.findAll({ where, order: [['createdAt', 'DESC']] })
    return res.json({ success: true, data: { notificaciones: notifs } })
  } catch (e) {
    console.error('listarNotificaciones error', e)
    return res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params
    const notif = await AdminNotificacion.findByPk(id)
    if (!notif) return res.status(404).json({ success: false, message: 'Notificación no encontrada' })
    await notif.update({ leido: true })
    req.app?.get('io_admin')?.emit('notification:read', { id: notif.id })
    return res.json({ success: true, message: 'Notificación marcada como leída' })
  } catch (e) {
    console.error('marcarLeida error', e)
    return res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export const responderNotificacion = async (req, res) => {
  try {
    const { id } = req.params
    const { respuesta } = req.body
    const notif = await AdminNotificacion.findByPk(id)
    if (!notif) return res.status(404).json({ success: false, message: 'Notificación no encontrada' })
    const msg = await MensajeContacto.findByPk(notif.meta?.contactoId)
    if (!msg) return res.status(404).json({ success: false, message: 'Mensaje de contacto no encontrado' })

    await msg.update({ respuesta, estado: 'respondido', respondido_por: req.user?.id_usuarios })

    // enviar correo al usuario
    await sendReplyToUser({ to: msg.email, subject: `Re: ${msg.asunto}`, html: `<p>${respuesta}</p>` })

    return res.json({ success: true, message: 'Respuesta enviada' })
  } catch (e) {
    console.error('responderNotificacion error', e)
    return res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}
