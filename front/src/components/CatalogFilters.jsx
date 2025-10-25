import { useState } from "react"
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

/**
 * CatalogFilters - Filtros para el catálogo de viajes
 */
export const CatalogFilters = ({ onFilterChange, onClear }) => {
  const [expanded, setExpanded] = useState(true)
  const [filters, setFilters] = useState({
    busqueda: "",
    destino: "",
    dificultad: "",
    duracion_min: 1,
    duracion_max: 30,
    precio_min: 0,
    precio_max: 500000,
  })

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleClear = () => {
    const clearedFilters = {
      busqueda: "",
      destino: "",
      dificultad: "",
      duracion_min: 1,
      duracion_max: 30,
      precio_min: 0,
      precio_max: 500000,
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
    if (key === "precio_min" || key === "precio_max") {
      return value !== 0 && value !== 500000
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
              Duración (días)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.duracion_min, filters.duracion_max]}
                onChange={(e, newValue) => {
                  handleChange("duracion_min", newValue[0])
                  handleChange("duracion_max", newValue[1])
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
              Rango de precio
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.precio_min, filters.precio_max]}
                onChange={(e, newValue) => {
                  handleChange("precio_min", newValue[0])
                  handleChange("precio_max", newValue[1])
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                min={0}
                max={500000}
                step={10000}
                marks={[
                  { value: 0, label: "$0" },
                  { value: 250000, label: "$250k" },
                  { value: 500000, label: "$500k" },
                ]}
              />
            </Box>
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  )
}
