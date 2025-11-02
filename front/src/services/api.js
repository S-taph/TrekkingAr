// ✅ URL base de la API - conectado con backend real en puerto 3003
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api"

const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Incluir cookies en todas las peticiones
    ...options,
  }

  try {
    console.log("[API] Request:", `${API_BASE_URL}${endpoint}`, config.method || 'GET')
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    console.log("[API] Response:", response.status, data)

    if (!response.ok) {
      // Si es un error de autenticación (401/403), limpiar cookies inválidas
      if (response.status === 401 || response.status === 403) {
        // Limpiar cookie inválida
        if (endpoint !== "/auth/logout" && endpoint !== "/auth/login") {
          console.log("[API] Token inválido detectado, limpiando cookies...")
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
      }
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    // Solo loguear errores que no sean de autenticación esperados
    if (!error.message?.includes("Token inválido") && !error.message?.includes("Token de acceso requerido")) {
      console.error("[API] Error:", error)
    }
    throw error
  }
}

// Wrapper para peticiones DELETE
const apiDeleteRequest = (endpoint, options = {}) => 
  apiRequest(endpoint, { method: "DELETE", ...options })


// Guías API
export const guiasAPI = {
  getGuias: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/guias?${queryString}`)
  },

  getGuiaById: (id) => apiRequest(`/guias/${id}`),

  createGuia: (guiaData) =>
    apiRequest("/guias", {
      method: "POST",
      body: JSON.stringify(guiaData),
    }),

  updateGuia: (id, guiaData) =>
    apiRequest(`/guias/${id}`, {
      method: "PUT",
      body: JSON.stringify(guiaData),
    }),

  deleteGuia: (id) =>
    apiRequest(`/guias/${id}`, {
      method: "DELETE",
    }),

  debugAllGuias: () => apiRequest("/guias/debug/all"),
}

// Viajes API
export const viajesAPI = {
  getViajes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/viajes?${queryString}`)
  },

  getPreciosStats: () => apiRequest("/viajes/stats/precios"),

  getDestinos: () => apiRequest("/viajes/destinos"),

  getViajeById: (id) => apiRequest(`/viajes/${id}`),

  createViaje: (viajeData) =>
    apiRequest("/viajes", {
      method: "POST",
      body: JSON.stringify(viajeData),
    }),

  updateViaje: (id, viajeData) =>
    apiRequest(`/viajes/${id}`, {
      method: "PUT",
      body: JSON.stringify(viajeData),
    }),

  deleteViaje: (id) =>
    apiRequest(`/viajes/${id}`, {
      method: "DELETE",
    }),

  // Subir imágenes del viaje
  uploadImages: async (viajeId, files) => {
    const formData = new FormData()
    files.forEach(file => formData.append("imagenes", file))

    const response = await fetch(`${API_BASE_URL}/viajes/${viajeId}/images`, {
      method: "POST",
      credentials: "include", // Incluir cookies de sesión
      body: formData, // No establecer Content-Type, el browser lo hace automático
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Error al subir las imágenes")
    }

    return await response.json()
  },

  // Eliminar imagen del viaje
  deleteImage: (viajeId, imageId) =>
    apiDeleteRequest(`/viajes/${viajeId}/images/${imageId}`),

  // Gestión de fechas de viaje
  getFechasViaje: (viajeId) => apiRequest(`/viajes/${viajeId}/fechas`),

  createFechaViaje: (viajeId, fechaData) =>
    apiRequest(`/viajes/${viajeId}/fechas`, {
      method: "POST",
      body: JSON.stringify(fechaData),
    }),

  updateFechaViaje: (viajeId, fechaId, fechaData) =>
    apiRequest(`/viajes/${viajeId}/fechas/${fechaId}`, {
      method: "PUT",
      body: JSON.stringify(fechaData),
    }),

  deleteFechaViaje: (viajeId, fechaId) =>
    apiRequest(`/viajes/${viajeId}/fechas/${fechaId}`, {
      method: "DELETE",
    }),
}

// ✅ Reservas API - conectado con backend real
export const reservasAPI = {
  // Obtener todas las reservas (admin)
  getReservas: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reservas?${queryString}`)
  },

  // Obtener mis reservas (usuario actual)
  getMisReservas: () => apiRequest("/reservas/mis-reservas"),

  // Obtener reserva por ID
  getReservaById: (id) => apiRequest(`/reservas/${id}`),

  // Crear nueva reserva
  createReserva: (reservaData) =>
    apiRequest("/reservas", {
      method: "POST",
      body: JSON.stringify(reservaData),
    }),

  // Actualizar estado de reserva (admin)
  updateReservaStatus: (id, estado, observaciones) =>
    apiRequest(`/reservas/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado_reserva: estado, observaciones_reserva: observaciones }),
    }),

  // Cancelar reserva
  cancelReserva: (id) =>
    apiRequest(`/reservas/${id}/cancelar`, {
      method: "PUT",
    }),
}

// Categorías API
export const categoriasAPI = {
  getCategorias: () => apiRequest("/categorias"),
}

// ✅ Usuarios API - conectado con backend real
export const usuariosAPI = {
  getUsuarios: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/usuarios?${queryString}`)
  },

  getUsuarioById: (id) => apiRequest(`/usuarios/${id}`),

  updateUsuario: (id, usuarioData) =>
    apiRequest(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuarioData),
    }),

  // Upload de avatar
  uploadAvatar: async (id, file) => {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData, // No establecer Content-Type, el browser lo hace automático
    })

    return await response.json()
  },

  // Cambiar contraseña
  changePassword: (id, passwordData) =>
    apiRequest(`/usuarios/${id}/change-password`, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),
}

// Auth API
export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiRequest("/auth/profile"),
}

// ✅ Carrito API - conectado con backend real
export const carritoAPI = {
  // Obtener items del carrito del usuario
  getCarrito: () => apiRequest("/carrito"),

  // Agregar item al carrito (backend usa /carrito/items y fechaViajeId)
  addItem: ({ id_fecha_viaje, cantidad }) =>
    apiRequest("/carrito/items", {
      method: "POST",
      body: JSON.stringify({
        fechaViajeId: id_fecha_viaje, // Backend espera fechaViajeId
        cantidad,
      }),
    }),

  // Actualizar cantidad de un item (backend usa /carrito/items/:id)
  updateItem: (id, cantidad) =>
    apiRequest(`/carrito/items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ cantidad }),
    }),

  // Eliminar item del carrito (backend usa /carrito/items/:id)
  deleteItem: (id) =>
    apiRequest(`/carrito/items/${id}`, {
      method: "DELETE",
    }),

  // Vaciar todo el carrito (TODO: verificar endpoint en backend)
  clearCarrito: () =>
    apiRequest("/carrito/clear", {
      method: "DELETE",
    }),

  // Procesar checkout
  checkout: () =>
    apiRequest("/carrito/checkout", {
      method: "POST",
    }),
}

// Contacto API
export const contactoAPI = {
  // Enviar mensaje de contacto
  sendMessage: (messageData) =>
    apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),
}

// ✅ Reviews API - conectado con backend real
export const reviewsAPI = {
  // Obtener reviews
  getReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reviews?${queryString}`)
  },

  // Obtener review por ID
  getReviewById: (id) => apiRequest(`/reviews/${id}`),

  // Crear review (público)
  createReview: (reviewData) =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  // Actualizar review (admin)
  updateReview: (id, reviewData) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),

  // Eliminar review (admin)
  deleteReview: (id) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),

  // Obtener estadísticas de reviews de un viaje
  getReviewStats: (viajeId) => apiRequest(`/reviews/viaje/${viajeId}/stats`),
}

// Notificaciones API
export const notificacionesAPI = {
  // Obtener notificaciones del admin (requiere auth admin)
  getAdminNotificaciones: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/admin/notificaciones?${queryString}`)
  },

  // Marcar notificación como leída
  markAsRead: (id) =>
    apiRequest(`/admin/notificaciones/${id}/read`, {
      method: "PUT",
    }),

  // Marcar todas como leídas
  markAllAsRead: () =>
    apiRequest("/admin/notificaciones/read-all", {
      method: "PUT",
    }),
}

// Pagos API
export const pagosAPI = {
  // Obtener tarjetas de prueba
  getTarjetasPrueba: () => apiRequest("/pagos/tarjetas-prueba"),

  // Procesar pago
  procesarPago: (pagoData) =>
    apiRequest("/pagos/procesar", {
      method: "POST",
      body: JSON.stringify(pagoData),
    }),

  // Obtener mis pagos
  getMisPagos: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/pagos/mis-pagos?${queryString}`)
  },
}

// Roles API - Gestión de múltiples roles por usuario
export const rolesAPI = {
  // Obtener roles de un usuario
  getUserRoles: (id_usuario) => apiRequest(`/roles/user/${id_usuario}`),

  // Asignar un rol a un usuario
  assignRole: (id_usuario, rolData) =>
    apiRequest(`/roles/user/${id_usuario}/assign`, {
      method: "POST",
      body: JSON.stringify(rolData),
    }),

  // Remover un rol de un usuario
  removeRole: (id_usuario, rolData) =>
    apiRequest(`/roles/user/${id_usuario}/remove`, {
      method: "POST",
      body: JSON.stringify(rolData),
    }),

  // Promover usuario a guía
  promoteToGuia: (id_usuario, guiaData) =>
    apiRequest(`/roles/user/${id_usuario}/promote-guia`, {
      method: "POST",
      body: JSON.stringify(guiaData),
    }),

  // Promover usuario a administrador
  promoteToAdmin: (id_usuario, adminData = {}) =>
    apiRequest(`/roles/user/${id_usuario}/promote-admin`, {
      method: "POST",
      body: JSON.stringify(adminData),
    }),
}

// Newsletter API
export const newsletterAPI = {
  // Suscribirse al newsletter (público)
  subscribe: (email, nombre = null) =>
    apiRequest("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, nombre, origen: "web" }),
    }),

  // Desuscribirse del newsletter (público)
  unsubscribe: (token) => apiRequest(`/newsletter/unsubscribe/${token}`),

  // Obtener lista de suscriptores (admin)
  getSuscriptores: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/newsletter/suscriptores${queryString ? `?${queryString}` : ""}`)
  },

  // Obtener estadísticas (admin)
  getStats: () => apiRequest("/newsletter/stats"),
}

// Campañas API
export const campaniasAPI = {
  // Obtener todas las campañas (admin)
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/campanias${queryString ? `?${queryString}` : ""}`)
  },

  // Obtener una campaña por ID (admin)
  getById: (id) => apiRequest(`/campanias/${id}`),

  // Crear nueva campaña (admin)
  create: (campaniaData) =>
    apiRequest("/campanias", {
      method: "POST",
      body: JSON.stringify(campaniaData),
    }),

  // Actualizar campaña (admin)
  update: (id, campaniaData) =>
    apiRequest(`/campanias/${id}`, {
      method: "PUT",
      body: JSON.stringify(campaniaData),
    }),

  // Eliminar campaña (admin)
  delete: (id) => apiDeleteRequest(`/campanias/${id}`),

  // Enviar campaña (admin)
  send: (id) =>
    apiRequest(`/campanias/${id}/send`, {
      method: "POST",
    }),

  // Obtener estadísticas de campaña (admin)
  getStats: (id) => apiRequest(`/campanias/${id}/stats`),
}
