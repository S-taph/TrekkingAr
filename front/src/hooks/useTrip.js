import { useState, useEffect } from "react"
import { viajesAPI } from "../services/api"

/**
 * Hook para obtener un viaje específico por ID
 * @param {number} id - ID del viaje
 * @returns {Object} { trip, loading, error, refetch }
 */
export const useTrip = (id) => {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTrip = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await viajesAPI.getViajeById(id)

      if (response.success) {
        // El backend devuelve { success: true, data: { viaje: {...} } }
        setTrip(response.data.viaje)
      } else {
        throw new Error(response.message || "Error cargando viaje")
      }
    } catch (err) {
      console.error("[useTrip] Error:", err)
      setError(err.message)
      setTrip(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTrip()
    }
  }, [id])

  return {
    trip,
    loading,
    error,
    refetch: fetchTrip,
  }
}
