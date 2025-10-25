import { useState, useEffect } from "react"
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Alert,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import Header from "../components/Header"
import { CatalogFilters } from "../components/CatalogFilters"
import { TripCard } from "../components/TripCard"
import { useViajes } from "../hooks/useViajes"

/**
 * CatalogPage - Página del catálogo de viajes
 */
export default function CatalogPage() {
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("fecha_creacion")
  const { viajes, loading, error, pagination, refetch } = useViajes()

  // Actualizar título de la página
  useEffect(() => {
    document.title = "Catálogo de Viajes - TrekkingAR"
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    refetch({ ...newFilters, sortBy }, 1)
  }

  const handleClearFilters = () => {
    setFilters({})
    refetch({ sortBy }, 1)
  }

  const handlePageChange = (event, page) => {
    refetch({ ...filters, sortBy }, page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (event) => {
    const newSortBy = event.target.value
    setSortBy(newSortBy)
    refetch({ ...filters, sortBy: newSortBy }, pagination.page)
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Título y subtítulo */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(45deg, #3E6D4A 30%, #D9A86C 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Explora Nuestros Viajes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Descubre experiencias únicas de trekking y aventura en la Argentina
          </Typography>
        </Box>

        {/* Filtros */}
        <CatalogFilters
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Header de resultados */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                Mostrando {viajes.length} de {pagination.total} viajes
              </>
            )}
          </Typography>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select value={sortBy} label="Ordenar por" onChange={handleSortChange}>
              <MenuItem value="fecha_creacion">Más recientes</MenuItem>
              <MenuItem value="precio_asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="precio_desc">Precio: mayor a menor</MenuItem>
              <MenuItem value="duracion_asc">Duración: menor a mayor</MenuItem>
              <MenuItem value="duracion_desc">Duración: mayor a menor</MenuItem>
              <MenuItem value="popularidad">Más populares</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Grid de viajes */}
        <Grid container spacing={3}>
          {loading
            ? // Skeletons durante carga
              Array.from(new Array(12)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <TripCard loading />
                </Grid>
              ))
            : viajes.length === 0
              ? // Sin resultados
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      px: 2,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No se encontraron viajes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intenta ajustar los filtros o buscar con otros términos
                    </Typography>
                  </Box>
                </Grid>
              : // Viajes
                viajes.map((trip) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={trip.id}>
                    <TripCard trip={trip} />
                  </Grid>
                ))}
        </Grid>

        {/* Paginación */}
        {!loading && pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
