import Groq from 'groq-sdk';
import { Viaje, Categoria } from '../models/associations.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Procesa un mensaje del chatbot y devuelve una respuesta usando Groq
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío',
      });
    }

    // Obtener información de viajes disponibles para el contexto
    const viajes = await Viaje.findAll({
      where: { activo: true },
      include: [{ model: Categoria, as: 'categoria' }],
      attributes: ['titulo', 'descripcion_corta', 'dificultad', 'duracion_dias', 'precio_base', 'destino'],
      limit: 10,
    });

    // Construir resumen de viajes para el contexto
    const viajesInfo = viajes.map(v =>
      `- ${v.titulo} (${v.destino}): ${v.dificultad}, ${v.duracion_dias} días, desde $${v.precio_base}`
    ).join('\n');

    // Contexto del sistema para el chatbot de TrekkingAR
    const systemContext = `Eres un asistente virtual amigable y profesional de TrekkingAR, una empresa de turismo de aventura especializada en trekkings y excursiones de montaña en Argentina.

INFORMACIÓN DE VIAJES DISPONIBLES:
${viajesInfo}

INFORMACIÓN DE CONTACTO:
- Email: info@trekkingar.com
- Teléfono: +54 294 442-8765
- WhatsApp: +54 9 294 442-8765 (disponible 24/7)
- Ubicación: San Carlos de Bariloche, Río Negro, Argentina

HORARIOS DE ATENCIÓN:
- Lunes a Viernes: 9:00 - 18:00
- Sábados: 9:00 - 13:00
- Domingos: Cerrado

Tu objetivo es ayudar a los clientes con:
- Información sobre viajes y trekkings disponibles
- Detalles sobre dificultad, duración y precios
- Proceso de reserva y políticas de cancelación
- Recomendaciones de viajes según el nivel de experiencia
- Información general sobre la empresa

Debes:
- Ser amable, profesional y entusiasta
- Usar lenguaje claro y accesible
- Proporcionar información precisa basada en los datos disponibles
- Si necesitan información detallada o hacer una reserva, guíalos al catálogo del sitio web
- Mantener las respuestas concisas pero informativas

NO debes:
- Inventar viajes o información que no está en los datos disponibles
- Hacer promesas sobre disponibilidad de cupos sin verificar
- Procesar pagos o reservas directamente (guiar al usuario al sistema de reservas)
- Compartir información sensible de usuarios, contraseñas o datos internos`;

    // Construir el array de mensajes para Groq
    const messages = [
      {
        role: 'system',
        content: systemContext,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    // Llamar a la API de Groq
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: process.env.LLAMA_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
    });

    const botResponse = chatCompletion.choices[0]?.message?.content ||
      'Lo siento, no pude procesar tu mensaje. Por favor, intenta de nuevo.';

    res.json({
      success: true,
      data: {
        response: botResponse,
      },
    });

  } catch (error) {
    console.error('[Chatbot] Error:', error);

    // Error específico de Groq API
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del chatbot. Por favor, contacta con soporte.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
