"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
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
  Button,
  Divider,
  Avatar,
} from "@mui/material"
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"
import { reservasAPI } from "../../services/api"

const getEstadoColor = (estado) => {
  switch (estado) {
    case "confirmada":
      return "success"
    case "pendiente":
      return "warning"
    case "cancelada":
      return "error"
    case "completada":
      return "info"
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function ReservasManager() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  })

  const [filters, setFilters] = useState({
    search: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
  })

  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [selectedReserva, setSelectedReserva] = useState(null)

  useEffect(() => {
    const loadReservas = async () => {
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

        const response = await reservasAPI.getReservas(params)

        if (response.success) {
          setReservas(response.data.reservas)
          setPagination(response.data.pagination)
        }
      } catch (error) {
        setError(error.message || "Error al cargar reservas")
      } finally {
        setLoading(false)
      }
    }

    loadReservas()
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

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

  const handleViewReserva = (reserva) => {
    setSelectedReserva(reserva)
    setShowDetail(true)
  }

  const handleEditReserva = (reserva) => {
    setSelectedReserva(reserva)
    setShowEdit(true)
  }

  const handleUpdateReserva = async (updatedData) => {
    try {
      setReservas((prev) =>
        prev.map((reserva) =>
          reserva.id_reserva === selectedReserva.id_reserva ? { ...reserva, ...updatedData } : reserva,
        ),
      )
      setShowEdit(false)
      setSelectedReserva(null)
    } catch (error) {
      setError(error.message || "Error al actualizar reserva")
    }
  }

  // Mock data para demostración
  useEffect(() => {
    if (reservas.length === 0 && !loading) {
      const mockReservas = [
        {
          id_reserva: 1,
          usuario: { nombre: "Juan", apellido: "Pérez", email: "juan@example.com" },
          viaje: { titulo: "Trekking al Aconcagua", duracion_dias: 7 },
          estado: "confirmada",
          fecha_reserva: "2024-01-15",
          fecha_viaje: "2024-02-15",
          cantidad_personas: 2,
          precio_total: 150000,
        },
        {
          id_reserva: 2,
          usuario: { nombre: "María", apellido: "González", email: "maria@example.com" },
          viaje: { titulo: "Cerro Torre Base Trek", duracion_dias: 5 },
          estado: "pendiente",
          fecha_reserva: "2024-01-20",
          fecha_viaje: "2024-03-10",
          cantidad_personas: 1,
          precio_total: 85000,
        },
      ]
      setReservas(mockReservas)
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 2, itemsPerPage: 12 })
      setLoading(false)
    }
  }, [reservas.length, loading])

  if (loading && reservas.length === 0) {
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
            Gestión de Reservas
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {pagination.totalItems} reservas encontradas
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
            <FilterIcon sx={{ mr: 1 }} />
            Filtros
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={3}>
              <TextField
                fullWidth
                label="Buscar reservas"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{ height: 56 }}
              />
            </Grid2>

            <Grid2 item xs={12} md={3}>
              <FormControl fullWidth sx={{ height: 56 }}>
                <InputLabel sx={{ lineHeight: "56px" }}>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  label="Estado"
                  onChange={(e) => handleFilterChange("estado", e.target.value)}
                  sx={{
                    height: 56,
                    "& .MuiSelect-select": { display: "flex", alignItems: "center", height: "100%" },
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha desde"
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => handleFilterChange("fecha_desde", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>

            <Grid2 item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha hasta"
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => handleFilterChange("fecha_hasta", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid2 container spacing={3}>
            {reservas.map((reserva) => (
              <Grid2 item xs={12} key={reserva.id_reserva}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 item xs={12} md={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {reserva.usuario?.nombre?.[0] || ""}{reserva.usuario?.apellido?.[0] || ""}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {reserva.usuario?.nombre} {reserva.usuario?.apellido}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reserva.usuario?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid2>

                      <Grid2 item xs={12} md={3}>
                        <Typography variant="subtitle1">{reserva.viaje?.titulo}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reserva.viaje?.duracion_dias} días
                        </Typography>
                      </Grid2>

                      <Grid2 item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Fecha del viaje
                        </Typography>
                        <Typography variant="body1">{formatDate(reserva.fecha_viaje)}</Typography>
                      </Grid2>

                      <Grid2 item xs={12} md={2} textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          Personas
                        </Typography>
                        <Typography variant="body1">{reserva.cantidad_personas}</Typography>
                        <Typography variant="h6" color="primary.main">
                          {formatCurrency(reserva.precio_total)}
                        </Typography>
                      </Grid2>

                      <Grid2 item xs={12} md={2} textAlign="right">
                        <Chip
                          label={reserva.estado}
                          color={getEstadoColor(reserva.estado)}
                          sx={{ textTransform: "capitalize", mb: 1 }}
                        />
                        <Box>
                          <Tooltip title="Ver detalles">
                            <IconButton size="small" onClick={() => handleViewReserva(reserva)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => handleEditReserva(reserva)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>

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

      {/* Modal de detalle premium */}
      <Dialog open={showDetail} onClose={() => setShowDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Reserva</DialogTitle>
        <DialogContent>
          {selectedReserva && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
              {/* Cliente */}
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Cliente
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><strong>Nombre:</strong> {selectedReserva.usuario?.nombre} {selectedReserva.usuario?.apellido}</Typography>
                <Typography><strong>Email:</strong> {selectedReserva.usuario?.email}</Typography>
              </Card>

              {/* Viaje */}
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Viaje
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><strong>Título:</strong> {selectedReserva.viaje?.titulo}</Typography>
                <Typography><strong>Duración:</strong> {selectedReserva.viaje?.duracion_dias} días</Typography>
                <Typography><strong>Fecha:</strong> {formatDate(selectedReserva.fecha_viaje)}</Typography>
              </Card>

              {/* Reserva */}
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Reserva
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography><strong>Estado:</strong></Typography>
                  <Chip label={selectedReserva.estado} color={getEstadoColor(selectedReserva.estado)} size="small" sx={{ textTransform: "capitalize" }} />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography><strong>Personas:</strong></Typography>
                  <Typography>{selectedReserva.cantidad_personas}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography><strong>Precio:</strong></Typography>
                  <Typography>{formatCurrency(selectedReserva.precio_total)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography><strong>Fecha de reserva:</strong></Typography>
                  <Typography>{formatDate(selectedReserva.fecha_reserva)}</Typography>
                </Box>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={showEdit} onClose={() => setShowEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Reserva</DialogTitle>
        <DialogContent>
          {selectedReserva && (
            <Box sx={{ mt: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={selectedReserva.estado}
                      label="Estado"
                      onChange={(e) => setSelectedReserva((prev) => ({ ...prev, estado: e.target.value }))}
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="confirmada">Confirmada</MenuItem>
                      <MenuItem value="cancelada">Cancelada</MenuItem>
                      <MenuItem value="completada">Completada</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 item xs={12}>
                  <TextField
                    fullWidth
                    label="Cantidad de personas"
                    type="number"
                    value={selectedReserva.cantidad_personas}
                    onChange={(e) =>
                      setSelectedReserva((prev) => ({ ...prev, cantidad_personas: Number.parseInt(e.target.value) }))
                    }
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <TextField
                    fullWidth
                    label="Fecha del viaje"
                    type="date"
                    value={selectedReserva.fecha_viaje?.split("T")[0] || selectedReserva.fecha_viaje}
                    onChange={(e) => setSelectedReserva((prev) => ({ ...prev, fecha_viaje: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <TextField
                    fullWidth
                    label="Precio total"
                    type="number"
                    value={selectedReserva.precio_total}
                    onChange={(e) =>
                      setSelectedReserva((prev) => ({ ...prev, precio_total: Number.parseFloat(e.target.value) }))
                    }
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Grid2>
              </Grid2>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button onClick={() => handleUpdateReserva(selectedReserva)} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
