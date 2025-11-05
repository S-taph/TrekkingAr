import express from "express"
import { body } from "express-validator"
import { register, login, getProfile, logout, googleAuth, googleCallback, getMe, verifyEmail, forgotPassword, resetPassword } from "../controllers/authController.js"
import passport from "passport"
import jwt from "jsonwebtoken"
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

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),
]

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("El token es requerido"),
  body("newPassword").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
]

// Rutas de autenticación
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/profile", authenticateToken, getProfile)
router.get("/me", authenticateToken, getMe) // Alias para /profile
router.post("/logout", logout)

// Verificación de email
router.get("/verify-email", verifyEmail)

// Recuperación de contraseña
router.post("/forgot-password", forgotPasswordValidation, forgotPassword)
router.post("/reset-password", resetPasswordValidation, resetPassword)

// Google OAuth2
router.get('/google', googleAuth)
router.get('/google/callback', googleCallback)

export default router
