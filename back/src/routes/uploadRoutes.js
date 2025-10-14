import express from 'express'
import path from 'path'
import { upload } from '../config/multer.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import ImagenViaje from '../models/ImagenViaje.js'

const router = express.Router()

router.post('/viajes/:id/images', authenticateToken, requireRole(['admin']), upload.array('images', 10), async (req, res) => {
  try {
    const viajeId = req.params.id
    const files = req.files || []
    const base = `${req.protocol}://${req.get('host')}`

    const urls = []
    for (const [index, f] of files.entries()) {
      const rel = f.path.split('uploads')[1]
      const url = `${base}/uploads${rel.replace(/\\/g, '/')}`
      urls.push(url)
      await ImagenViaje.create({ id_viaje: viajeId, url, orden: index })
    }

    return res.status(201).json({ success: true, message: 'Imágenes subidas', data: { urls } })
  } catch (e) {
    console.error('upload images error', e)
    return res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

export default router
