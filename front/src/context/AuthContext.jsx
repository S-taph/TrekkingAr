"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.getProfile()
      if (response.success) {
        setUser(response.data.user)
      } else {
        // Si la respuesta no es exitosa, limpiar usuario
        setUser(null)
      }
    } catch (error) {
      // Si hay error de autenticación, el token ya fue limpiado en api.js
      console.log("[AuthContext] No hay sesión activa o token inválido:", error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      if (response.success) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
      setUser(null)
    } catch (error) {
      console.error("[v0] Error en logout:", error)
    }
  }, [])

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }))
  }, [])

  const value = useCallback(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, loading, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value()}>{children}</AuthContext.Provider>
}
