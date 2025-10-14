import express from "express"
import { body } from "express-validator"
import { register, login, getProfile, logout } from "../controllers/authController.js"
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

// Rutas
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/profile", authenticateToken, getProfile)
router.post("/logout", logout)

// Google OAuth2
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id_usuarios }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  // Optionally redirect to frontend
  const redirectUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/auth/callback'
  res.redirect(redirectUrl)
})

export default router
