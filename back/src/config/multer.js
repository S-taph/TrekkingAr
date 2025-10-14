// Multer local storage for Viaje images
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsRoot = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const viajeId = req.params.id || req.params.viajeId
    let dest = uploadsRoot
    if (viajeId) {
      dest = path.join(uploadsRoot, 'viajes', String(viajeId))
    } else {
      dest = path.join(uploadsRoot, 'temp')
    }
    fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `${timestamp}-${Math.random().toString(36).slice(2)}${ext}`)
  }
})

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido'), false)
  }
  cb(null, true)
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
export const uploadsRootPath = uploadsRoot
