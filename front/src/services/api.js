// URL base de la API
const API_BASE_URL = "http://localhost:3000/api"

const getAuthToken = () => {
  // Por ahora usamos un token mock para admin
  // En producción esto vendría del login del usuario
  return "mock-admin-token"
}

// Configuración base para fetch
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-bypass-auth": "true",
      ...(endpoint.includes("/guias") &&
      (options.method === "POST" || options.method === "PUT" || options.method === "DELETE")
        ? { Authorization: `Bearer ${getAuthToken()}` }
        : {}),
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log("[v0] Haciendo petición a:", `${API_BASE_URL}${endpoint}`) // Debug
    console.log("[v0] Configuración:", config) // Debug

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    console.log("[v0] Respuesta del servidor:", { status: response.status, data }) // Debug

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

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
}

// Viajes API
export const viajesAPI = {
  getViajes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/viajes?${queryString}`)
  },

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
}

// Reservas API
export const reservasAPI = {
  getReservas: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reservas?${queryString}`)
  },

  getReservaById: (id) => apiRequest(`/reservas/${id}`),

  updateReservaStatus: (id, estado, observaciones) =>
    apiRequest(`/reservas/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado_reserva: estado, observaciones_reserva: observaciones }),
    }),
}

// Categorías API
export const categoriasAPI = {
  getCategorias: () => apiRequest("/categorias"),
}

// Usuarios API

export const usuariosAPI = {
  getUsuarios: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/usuarios?${queryString}`)
  },

  getUsuarioById: (id) => apiRequest(`/usuarios/${id}`),

  createUsuario: (usuarioData) =>
    apiRequest("/usuarios", {
      method: "POST",
      body: JSON.stringify(usuarioData),
    }),

  updateUsuario: (id, usuarioData) =>
    apiRequest(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuarioData),
    }),

  deleteUsuario: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: "DELETE",
    }),
}