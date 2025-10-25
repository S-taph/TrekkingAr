import express from 'express'
import { getUsuarios, getUsuarioById, updateUsuario, uploadAvatar } from '../controllers/usuarioController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import { upload } from '../config/multer.js'

const router = express.Router()

// Rutas públicas o protegidas
router.get('/', authenticateToken, requireRole(['admin']), getUsuarios)
router.get('/:id', authenticateToken, getUsuarioById)
router.put('/:id', authenticateToken, updateUsuario)
router.post('/:id/avatar', authenticateToken, upload.single('avatar'), uploadAvatar)

export default router