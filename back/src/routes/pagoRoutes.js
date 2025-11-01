import express from "express"
import { body } from "express-validator"
import { procesarPago, obtenerPagosUsuario, obtenerTarjetasPrueba } from "../controllers/pagoController.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Validaciones para procesar pago
const pagoValidation = [
  body("id_compra").isInt({ min: 1 }).withMessage("ID de compra debe ser un número entero positivo"),
  body("metodo_pago").isIn(["tarjeta", "pagar_despues"]).withMessage("Método de pago inválido"),
  body("card_data")
    .optional()
    .isObject()
    .withMessage("Datos de tarjeta deben ser un objeto")
    .custom((value, { req }) => {
      if (req.body.metodo_pago === "tarjeta") {
        if (!value || !value.numero || !value.nombre || !value.vencimiento || !value.cvv) {
          throw new Error("Datos de tarjeta incompletos")
        }
      }
      return true
    }),
]

// Rutas protegidas
router.post("/procesar", authenticateToken, pagoValidation, procesarPago)
router.get("/mis-pagos", authenticateToken, obtenerPagosUsuario)

// Ruta pública para obtener tarjetas de prueba (solo desarrollo)
router.get("/tarjetas-prueba", obtenerTarjetasPrueba)

export default router
