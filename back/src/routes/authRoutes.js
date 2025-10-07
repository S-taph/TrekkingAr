import express from "express"
import { body } from "express-validator"
import { register, login, getProfile, logout } from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Validaciones
const registerValidation = [
  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre").trim().isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
  body("apellido").trim().isLength({ min: 2 }).withMessage("El apellido debe tener al menos 2 caracteres"),
]

const loginValidation = [
  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
]

// Rutas
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/profile", authenticateToken, getProfile)
router.post("/logout", logout)

export default router
