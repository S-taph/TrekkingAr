import express from 'express'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import { contactValidation, crearContacto, listarNotificaciones, marcarLeida, responderNotificacion } from '../controllers/contactoController.js'

const router = express.Router()

router.post('/contact', contactValidation, crearContacto)
router.get('/admin/notificaciones', authenticateToken, requireRole(['admin']), listarNotificaciones)
router.put('/admin/notificaciones/:id/read', authenticateToken, requireRole(['admin']), marcarLeida)
router.post('/admin/notificaciones/:id/reply', authenticateToken, requireRole(['admin']), responderNotificacion)

export default router
