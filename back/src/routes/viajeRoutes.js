/**
 * Viaje Routes
 * 
 * Rutas para el manejo de viajes y sus imágenes.
 * Las rutas de administración requieren autenticación y rol de administrador.
 */

import express from "express";
import { param, query } from "express-validator";
import { 
  getViajes, 
  getViajeById, 
  uploadImagenes, 
  deleteImagen, 
  updateImagenOrder 
} from "../controllers/viajeController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { upload, handleMulterError } from "../config/multer.js";

const router = express.Router();

// Validaciones
const viajeIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID de viaje debe ser un número entero positivo")
];

const imagenIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID de viaje debe ser un número entero positivo"),
  param("imagenId")
    .isInt({ min: 1 })
    .withMessage("ID de imagen debe ser un número entero positivo")
];

// Rutas públicas
router.get("/", getViajes);
router.get("/:id", viajeIdValidation, getViajeById);

// Rutas de administración (requieren autenticación y rol admin)
router.use(authenticateToken);
router.use(requireAdmin);

// Upload de imágenes (múltiples archivos)
router.post(
  "/:id/images", 
  viajeIdValidation,
  upload.array('imagenes', 10), // Máximo 10 imágenes
  handleMulterError,
  uploadImagenes
);

// Eliminar imagen
router.delete("/:id/images/:imagenId", imagenIdValidation, deleteImagen);

// Actualizar orden de imágenes
router.put("/:id/images/order", viajeIdValidation, updateImagenOrder);

export default router;