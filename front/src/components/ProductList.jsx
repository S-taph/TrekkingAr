"use client"

import { useEffect, useMemo } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import { TripCard } from "./TripCard"
import { useViajes } from "../hooks/useViajes"

const ProductList = ({ searchFilters = {}, sidebarFilters = {} }) => {
  console.log("[ProductList] searchFilters:", searchFilters)
  console.log("[ProductList] sidebarFilters:", sidebarFilters)

  // Combinar todos los filtros para la API
  const apiFilters = useMemo(() => {
    const filters = { activo: true }

    // Filtros de búsqueda
    if (searchFilters.lugar && searchFilters.lugar.trim() !== "") {
      filters.search = searchFilters.lugar
    }
    if (searchFilters.dificultad && searchFilters.dificultad !== "") {
      filters.dificultad = searchFilters.dificultad
    }
    if (searchFilters.dias && searchFilters.dias !== "") {
      filters.duracion_dias = Number.parseInt(searchFilters.dias)
    }

    // Filtros del sidebar
    if (sidebarFilters.category && sidebarFilters.category.length > 0) {
      filters.id_categoria = sidebarFilters.category[0] // API acepta un solo valor
    }
    if (sidebarFilters.difficulty && sidebarFilters.difficulty.length > 0) {
      filters.dificultad = sidebarFilters.difficulty[0]
    }
    if (sidebarFilters.priceRange) {
      const [min, max] = sidebarFilters.priceRange
      filters.precio_min = min
      filters.precio_max = max
    }

    return filters
  }, [searchFilters, sidebarFilters])

  const { viajes, loading, error, refetch } = useViajes(apiFilters)

  // Refetch cuando cambien los filtros
  useEffect(() => {
    refetch(apiFilters)
  }, [apiFilters, refetch])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        Error al cargar viajes: {error}
      </Alert>
    )
  }

  if (viajes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No se encontraron viajes con los filtros seleccionados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
        },
        justifyContent: "center",
      }}
    >
      {viajes.map((viaje) => (
        <TripCard key={viaje.id_viaje} trip={viaje} />
      ))}
    </Box>
  )
}

export default ProductList
