import { useState, useEffect, useRef } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Chip,
  Stack,
  Collapse,
  IconButton,
} from "@mui/material"
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"
import { viajesAPI } from "../services/api"

/**
 * CatalogFilters - Filtros para el catálogo de viajes
 */
export const CatalogFilters = ({ onFilterChange, onClear }) => {
  const [expanded, setExpanded] = useState(true)
  const [maxPrice, setMaxPrice] = useState(500000)
  const [filters, setFilters] = useState({
    busqueda: "",
    destino: "",
    dificultad: "",
    duracion_min: 1,
    duracion_max: 30,
    precio_min: 0,
    precio_max: 500000,
  })

  // Refs para debouncing
  const debounceTimer = useRef(null)

  // Cargar precio máximo dinámicamente
  useEffect(() => {
    const fetchPriceStats = async () => {
      try {
        const response = await viajesAPI.getPreciosStats()
        if (response.success) {
          const max = Math.ceil(response.data.precio_maximo / 10000) * 10000
          setMaxPrice(max)
          setFilters(prev => ({ ...prev, precio_max: max }))
        }
      } catch (error) {
        console.error("Error obteniendo estadísticas de precios:", error)
      }
    }
    fetchPriceStats()
  }, [])

  // Cleanup del timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const handleChange = (field, value, immediate = true) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)

    if (immediate) {
      // Para dropdowns y text inputs: aplicar inmediatamente
      onFilterChange?.(newFilters)
    } else {
      // Para sliders: aplicar con debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        onFilterChange?.(newFilters)
      }, 500) // 500ms de delay
    }
  }

  const handleClear = () => {
    const clearedFilters = {
      busqueda: "",
      destino: "",
      dificultad: "",
      duracion_min: 1,
      duracion_max: 30,
      precio_min: 0,
      precio_max: maxPrice,
    }
    setFilters(clearedFilters)
    onClear?.()
    onFilterChange?.(clearedFilters)
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "busqueda" || key === "destino" || key === "dificultad") {
      return value !== ""
    }
    if (key === "duracion_min" || key === "duracion_max") {
      return value !== 1 && value !== 30
    }
    if (key === "precio_min") {
      return value !== 0
    }
    if (key === "precio_max") {
      return value !== maxPrice
    }
    return false
  }).length

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 2 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip label={activeFiltersCount} size="small" color="primary" />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {activeFiltersCount > 0 && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClear}
            >
              Limpiar
            </Button>
          )}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Filtros */}
      <Collapse in={expanded}>
        <Stack spacing={3}>
          {/* Búsqueda */}
          <TextField
            fullWidth
            label="Buscar viaje"
            placeholder="Nombre, ubicación, actividad..."
            value={filters.busqueda}
            onChange={(e) => handleChange("busqueda", e.target.value)}
            size="small"
          />

          {/* Destino y Dificultad */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Destino</InputLabel>
              <Select
                value={filters.destino}
                label="Destino"
                onChange={(e) => handleChange("destino", e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="patagonia">Patagonia</MenuItem>
                <MenuItem value="mendoza">Mendoza</MenuItem>
                <MenuItem value="salta">Salta</MenuItem>
                <MenuItem value="cordoba">Córdoba</MenuItem>
                <MenuItem value="neuquen">Neuquén</MenuItem>
                <MenuItem value="ushuaia">Ushuaia</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Dificultad</InputLabel>
              <Select
                value={filters.dificultad}
                label="Dificultad"
                onChange={(e) => handleChange("dificultad", e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="facil">Fácil</MenuItem>
                <MenuItem value="moderada">Moderada</MenuItem>
                <MenuItem value="dificil">Difícil</MenuItem>
                <MenuItem value="extrema">Extrema</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Duración */}
          <Box>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              Duración (días): {filters.duracion_min} - {filters.duracion_max}
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.duracion_min, filters.duracion_max]}
                onChange={(e, newValue) => {
                  setFilters({ ...filters, duracion_min: newValue[0], duracion_max: newValue[1] })
                }}
                onChangeCommitted={(e, newValue) => {
                  handleChange("duracion_min", newValue[0], false)
                  handleChange("duracion_max", newValue[1], false)
                }}
                valueLabelDisplay="auto"
                min={1}
                max={30}
                marks={[
                  { value: 1, label: "1" },
                  { value: 15, label: "15" },
                  { value: 30, label: "30" },
                ]}
              />
            </Box>
          </Box>

          {/* Precio */}
          <Box>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              Rango de precio: ${filters.precio_min.toLocaleString()} - ${filters.precio_max.toLocaleString()}
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.precio_min, filters.precio_max]}
                onChange={(e, newValue) => {
                  setFilters({ ...filters, precio_min: newValue[0], precio_max: newValue[1] })
                }}
                onChangeCommitted={(e, newValue) => {
                  handleChange("precio_min", newValue[0], false)
                  handleChange("precio_max", newValue[1], false)
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                min={0}
                max={maxPrice}
                step={10000}
                marks={[
                  { value: 0, label: "$0" },
                  { value: Math.floor(maxPrice / 2), label: `$${Math.floor(maxPrice / 2 / 1000)}k` },
                  { value: maxPrice, label: `$${Math.floor(maxPrice / 1000)}k` },
                ]}
              />
            </Box>
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  )
}
