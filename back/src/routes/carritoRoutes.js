import express from "express"
import { body, param } from "express-validator"
import { authenticateToken } from "../middleware/auth.js"
import { getCarrito, addItem, updateItem, deleteItem, checkout } from "../controllers/carritoController.js"

const router = express.Router()

router.get("/", authenticateToken, getCarrito)
router.post(
  "/items",
  authenticateToken,
  [body("id_fecha_viaje").isInt({ min: 1 }), body("cantidad").isInt({ min: 1 })],
  addItem,
)
router.put("/items/:id", authenticateToken, [param("id").isInt({ min: 1 }), body("cantidad").isInt({ min: 1 })], updateItem)
router.delete("/items/:id", authenticateToken, [param("id").isInt({ min: 1 })], deleteItem)
router.post("/checkout", authenticateToken, checkout)

export default router
