import express from "express"
import { body, param } from "express-validator"
import {
  getAllViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
  getViajesByCategoria,
} from "../controllers/viajeController.js"
import { authenticateToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

// Validaciones
const viajeValidation = [
  body("id_categoria").isInt({ min: 1 }).withMessage("ID de categoría debe ser un número entero positivo"),
  body("titulo").trim().isLength({ min: 3, max: 255 }).withMessage("El título debe tener entre 3 y 255 caracteres"),
  body("descripcion_corta").optional().isLength({ max: 1000 }).withMessage("Descripción corta muy larga"),
  body("dificultad").isIn(["facil", "moderado", "dificil", "extremo"]).withMessage("Dificultad inválida"),
  body("duracion_dias").isInt({ min: 1 }).withMessage("Duración debe ser un número entero positivo"),
  body("precio_base").isFloat({ min: 0 }).withMessage("Precio base debe ser un número positivo"),
  body("minimo_participantes").optional().isInt({ min: 1 }).withMessage("Mínimo participantes inválido"),
]

const idValidation = [param("id").isInt({ min: 1 }).withMessage("ID debe ser un número entero positivo")]

// Rutas públicas
router.get("/", getAllViajes)
router.get("/categoria/:categoriaId", getViajesByCategoria)
router.get("/:id", idValidation, getViajeById)

// Rutas protegidas (solo admin)
router.post("/", authenticateToken, requireRole(["admin"]), viajeValidation, createViaje)
router.put("/:id", authenticateToken, requireRole(["admin"]), idValidation, viajeValidation, updateViaje)
router.delete("/:id", authenticateToken, requireRole(["admin"]), idValidation, deleteViaje)

export default router
