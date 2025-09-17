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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import { viajesAPI } from "../../services/api"
import ViajeForm from "./ViajeForm"
import ViajeDetail from "./ViajeDetail"
import products from "../../data/products"

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

const convertProductsToViajes = (products) => {
  return products.map((product) => ({
    id_viaje: `temp_${product.id}`,
    titulo: product.name,
    descripcion_corta: `Viaje de ${product.category?.toLowerCase() || "aventura"} con calificación ${product.rating}/5`,
    categoria: { nombre: product.category || "Aventura" },
    dificultad: product.category === "Montaña" ? "moderado" : "facil",
    duracion_dias: Math.floor(Math.random() * 7) + 1, // Random 1-7 days
    precio_base: product.price,
    activo: true,
    isExample: true, // Flag to identify example data
  }))
}

export default function ViajesManager() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showingExampleData, setShowingExampleData] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  })

  const [filters, setFilters] = useState({
    search: "",
    dificultad: "",
    activo: "true",
    precio_min: "",
    precio_max: "",
  })

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedViaje, setSelectedViaje] = useState(null)
  const [formMode, setFormMode] = useState("create") // 'create' o 'edit'

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

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      console.log("[v0] Cargando viajes con parámetros:", params)
      const response = await viajesAPI.getViajes(params)
      console.log("[v0] Respuesta del servidor para viajes:", response)

      if (response.success && response.data.viajes.length > 0) {
        setViajes(response.data.viajes)
        setPagination(response.data.pagination)
        setShowingExampleData(false)
        console.log("[v0] Viajes cargados:", response.data.viajes.length)
      } else {
        console.log("[v0] No hay viajes en la base de datos, usando datos de ejemplo")
        const exampleViajes = convertProductsToViajes(products)
        setViajes(exampleViajes)
        setShowingExampleData(true)
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: exampleViajes.length,
          itemsPerPage: 12,
        })
      }
    } catch (error) {
      console.error("[v0] Error en loadViajes:", error)
      console.log("[v0] Error al cargar viajes, usando datos de ejemplo")
      const exampleViajes = convertProductsToViajes(products)
      setViajes(exampleViajes)
      setShowingExampleData(true)
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: exampleViajes.length,
        itemsPerPage: 12,
      })
      setError("No se pudieron cargar los viajes de la base de datos. Mostrando datos de ejemplo.")
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
    if (viaje.isExample) {
      setError("No puedes editar viajes de ejemplo. Primero debes guardarlos en la base de datos.")
      return
    }
    setSelectedViaje(viaje)
    setFormMode("edit")
    setShowForm(true)
  }

  const handleViewViaje = (viaje) => {
    setSelectedViaje(viaje)
    setShowDetail(true)
  }

  const handleDeleteViaje = (viaje) => {
    if (viaje.isExample) {
      setError("No puedes eliminar viajes de ejemplo.")
      return
    }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Viajes
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {pagination.totalItems} viajes encontrados
            {showingExampleData && " (datos de ejemplo)"}
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

      {showingExampleData && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
          Se están mostrando datos de ejemplo del archivo products.js porque no hay viajes en la base de datos. Los
          viajes de ejemplo no pueden ser editados o eliminados.
        </Alert>
      )}

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

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Dificultad</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viajes.map((viaje) => (
                  <TableRow
                    key={viaje.id_viaje}
                    hover
                    sx={viaje.isExample ? { backgroundColor: "rgba(255, 235, 59, 0.1)" } : {}}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {viaje.titulo}
                          {viaje.isExample && (
                            <Chip label="Ejemplo" size="small" color="warning" sx={{ ml: 1, fontSize: "0.7rem" }} />
                          )}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 300 }}>
                          {viaje.descripcion_corta?.substring(0, 80)}
                          {viaje.descripcion_corta?.length > 80 && "..."}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{viaje.categoria?.nombre || "Sin categoría"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={viaje.dificultad}
                        color={getDificultadColor(viaje.dificultad)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{viaje.duracion_dias} días</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary.main" fontWeight="medium">
                        {formatCurrency(viaje.precio_base)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={viaje.activo ? "Activo" : "Inactivo"}
                        color={viaje.activo ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" onClick={() => handleViewViaje(viaje)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={viaje.isExample ? "No se puede editar datos de ejemplo" : "Editar"}>
                          <span>
                            <IconButton size="small" onClick={() => handleEditViaje(viaje)} disabled={viaje.isExample}>
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={viaje.isExample ? "No se puede eliminar datos de ejemplo" : "Eliminar"}>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteViaje(viaje)}
                              disabled={viaje.isExample}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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

      <Dialog open={showDetail} onClose={() => setShowDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Viaje</DialogTitle>
        <DialogContent>
          <ViajeDetail viaje={selectedViaje} onEdit={() => handleEditViaje(selectedViaje)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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
