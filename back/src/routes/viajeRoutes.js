import express from "express";
import { param, body } from "express-validator";
import {
  getViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
  uploadImagenes,
  deleteImagen,
  updateImagenOrder,
  getPreciosStats,
  getDestinos
} from "../controllers/viajeController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { upload, handleMulterError } from "../config/multer.js";
import fechaViajeRoutes from "./fechaViajeRoutes.js";

const router = express.Router();

// Validaciones
const viajeIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID de viaje debe ser un número entero positivo")
];

const createViajeValidation = [
  body("titulo").notEmpty().withMessage("El título es requerido"),
  body("descripcion").notEmpty().withMessage("La descripción es requerida"),
  body("destino").notEmpty().withMessage("El destino es requerido"),
  body("duracion_dias").isInt({ min: 1 }).withMessage("La duración debe ser al menos 1 día"),
  body("dificultad").isIn(['facil', 'moderada', 'dificil', 'extrema']).withMessage("Dificultad inválida"),
  body("precio_base").isFloat({ min: 0 }).withMessage("El precio debe ser mayor o igual a 0")
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
router.get("/stats/precios", getPreciosStats);
router.get("/destinos", getDestinos);
router.get("/", getViajes);
router.get("/:id", viajeIdValidation, getViajeById);

// Rutas de administración
router.use(authenticateToken);
router.use(requireAdmin);

// CRUD de viajes
router.post("/", createViajeValidation, createViaje);
router.put("/:id", viajeIdValidation, updateViaje);
router.delete("/:id", viajeIdValidation, deleteViaje);

// 🔹 Upload de imágenes (múltiples archivos)
router.post(
  "/:id/images",
  viajeIdValidation,
  upload.array('imagenes', 10), // debe coincidir con frontend
  handleMulterError,
  uploadImagenes
);

// Eliminar imagen
router.delete("/:id/images/:imagenId", imagenIdValidation, deleteImagen);

// Actualizar orden de imágenes
router.put("/:id/images/order", viajeIdValidation, updateImagenOrder);

// Sub-rutas de fechas de viaje
router.use("/:viajeId/fechas", fechaViajeRoutes);

export default router;
