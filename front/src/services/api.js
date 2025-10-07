// URL base de la API
const API_BASE_URL = "http://localhost:3000/api"

const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-bypass-auth": "true",
      ...options.headers,
    },
    credentials: "include", // Incluir cookies en todas las peticiones
    ...options,
  }

  try {
    console.log("[v0] API Request:", `${API_BASE_URL}${endpoint}`, config)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    console.log("[v0] API Response:", response.status, data)

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

  debugAllGuias: () => apiRequest("/guias/debug/all"),
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
