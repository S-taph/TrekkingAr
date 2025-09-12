import express from "express"
import { body, param } from "express-validator"
import { getAllGuias, getGuiaById, createGuia, updateGuia, debugAllGuias } from "../controllers/guiaController.js"
import { authenticateToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

// Validaciones
const guiaValidation = [
  body("id_usuario").isInt({ min: 1 }).withMessage("ID de usuario debe ser un número entero positivo"),
  body("certificaciones").optional().isLength({ max: 1000 }).withMessage("Certificaciones muy largas"),
  body("especialidades").optional().isLength({ max: 500 }).withMessage("Especialidades muy largas"),
  body("anos_experiencia").isInt({ min: 0, max: 50 }).withMessage("Años de experiencia debe ser entre 0 y 50"),
  body("idiomas").optional().isLength({ max: 200 }).withMessage("Idiomas muy largos"),
  body("tarifa_por_dia").isFloat({ min: 0 }).withMessage("Tarifa debe ser un número positivo"),
  body("disponible").optional().isBoolean().withMessage("Disponible debe ser verdadero o falso"),
]

const idValidation = [param("id").isInt({ min: 1 }).withMessage("ID debe ser un número entero positivo")]

// Rutas públicas
router.get("/", getAllGuias)
router.get("/:id", idValidation, getGuiaById)

router.get("/debug/all", debugAllGuias)

// Rutas protegidas (solo admin para crear/actualizar)
router.post("/", authenticateToken, requireRole(["admin"]), guiaValidation, createGuia)
router.put("/:id", authenticateToken, requireRole(["admin"]), idValidation, guiaValidation, updateGuia)

export default router
