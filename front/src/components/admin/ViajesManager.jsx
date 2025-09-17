"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid2,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"
import { viajesAPI } from "../../services/api"
import ViajeForm from "./ViajeForm"
import ViajeDetail from "./ViajeDetail"

const getDificultadColor = (dificultad) => {
  switch (dificultad) {
    case "facil":
      return "success"
    case "moderado":
      return "warning"
    case "dificil":
      return "error"
    case "extremo":
      return "error"
    default:
      return "default"
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount)
}

export default function ViajesManager() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  })

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: "",
    dificultad: "",
    activo: "true",
    precio_min: "",
    precio_max: "",
  })

  // Estados para modales
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedViaje, setSelectedViaje] = useState(null)
  const [formMode, setFormMode] = useState("create") // 'create' o 'edit'

  // Estados para confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [viajeToDelete, setViajeToDelete] = useState(null)

const loadViajes = useCallback(async () => {
  try {
    setLoading(true)
    const params = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      ...filters,
    }

    // Limpiar parámetros vacíos
    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await viajesAPI.getViajes(params)

    if (response.success) {
      setViajes(response.data.viajes)
      setPagination(response.data.pagination)
    }
  } catch (error) {
    setError(error.message || "Error al cargar viajes")
  } finally {
    setLoading(false)
  }
}, [pagination.currentPage, pagination.itemsPerPage, filters])

  useEffect(() => {
  loadViajes()
}, [loadViajes])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleCreateViaje = () => {
    setSelectedViaje(null)
    setFormMode("create")
    setShowForm(true)
  }

  const handleEditViaje = (viaje) => {
    setSelectedViaje(viaje)
    setFormMode("edit")
    setShowForm(true)
  }

  const handleViewViaje = (viaje) => {
    setSelectedViaje(viaje)
    setShowDetail(true)
  }

  const handleDeleteViaje = (viaje) => {
    setViajeToDelete(viaje)
    setDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await viajesAPI.deleteViaje(viajeToDelete.id_viaje)
      setDeleteDialog(false)
      setViajeToDelete(null)
      loadViajes()
    } catch (error) {
      setError(error.message || "Error al eliminar viaje")
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    loadViajes()
  }

  if (loading && viajes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Viajes
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {pagination.totalItems} viajes encontrados
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateViaje}>
          Nuevo Viaje
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Filtros
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar viajes"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid2>
            <Grid2 item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={filters.dificultad}
                  label="Dificultad"
                  onChange={(e) => handleFilterChange("dificultad", e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="facil">Fácil</MenuItem>
                  <MenuItem value="moderado">Moderado</MenuItem>
                  <MenuItem value="dificil">Difícil</MenuItem>
                  <MenuItem value="extremo">Extremo</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.activo}
                  label="Estado"
                  onChange={(e) => handleFilterChange("activo", e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Activos</MenuItem>
                  <MenuItem value="false">Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={12} md={2}>
              <TextField
                fullWidth
                label="Precio mínimo"
                type="number"
                value={filters.precio_min}
                onChange={(e) => handleFilterChange("precio_min", e.target.value)}
              />
            </Grid2>
            <Grid2 item xs={12} md={2}>
              <TextField
                fullWidth
                label="Precio máximo"
                type="number"
                value={filters.precio_max}
                onChange={(e) => handleFilterChange("precio_max", e.target.value)}
              />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Lista de viajes */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid2 container spacing={3}>
            {viajes.map((viaje) => (
              <Grid2 item xs={12} sm={6} md={4} key={viaje.id_viaje}>
                <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {viaje.titulo}
                      </Typography>
                      <Chip
                        label={viaje.activo ? "Activo" : "Inactivo"}
                        color={viaje.activo ? "success" : "default"}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" paragraph>
                      {viaje.descripcion_corta?.substring(0, 100)}
                      {viaje.descripcion_corta?.length > 100 && "..."}
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={viaje.dificultad}
                        color={getDificultadColor(viaje.dificultad)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                      <Chip label={`${viaje.duracion_dias} días`} variant="outlined" size="small" />
                    </Box>

                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(viaje.precio_base)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      Categoría: {viaje.categoria?.nombre || "Sin categoría"}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" onClick={() => handleViewViaje(viaje)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEditViaje(viaje)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDeleteViaje(viaje)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Modal de formulario */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{formMode === "create" ? "Crear Nuevo Viaje" : "Editar Viaje"}</DialogTitle>
        <DialogContent>
          <ViajeForm
            viaje={selectedViaje}
            mode={formMode}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de detalle */}
      <Dialog open={showDetail} onClose={() => setShowDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Viaje</DialogTitle>
        <DialogContent>
          <ViajeDetail viaje={selectedViaje} onEdit={() => handleEditViaje(selectedViaje)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el viaje "{viajeToDelete?.titulo}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
