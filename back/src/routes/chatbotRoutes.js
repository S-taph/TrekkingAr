import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * POST /api/chatbot
 * Envía un mensaje al chatbot y recibe una respuesta
 *
 * Body:
 * - message: string (requerido) - El mensaje del usuario
 * - conversationHistory: array (opcional) - Historial de conversación
 */
router.post('/', sendMessage);

export default router;
