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
  Avatar,
  Rating,
  Skeleton,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
} from "@mui/icons-material"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { guiasAPI } from "../../services/api"
import GuiaForm from "./GuiaForm"
import GuiaDetail from "./GuiaDetail"

export default function GuiasManager() {
  const [guias, setGuias] = useState([])
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
    especialidad: "",
    disponible: "",
  })

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedGuia, setSelectedGuia] = useState(null)
  const [formMode, setFormMode] = useState("create")

  const loadGuias = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      }

      if (params.disponible !== undefined && params.disponible !== "") {
        params.activo = params.disponible === "true"
        delete params.disponible
      }

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      const response = await guiasAPI.getGuias(params)

      if (response.success) {
        setGuias(response.data.guias)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || "Error al cargar guías")
      }
    } catch (error) {
      setError(error.message || "Error al cargar guías")
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

  useEffect(() => {
    loadGuias()
  }, [loadGuias])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleCreateGuia = () => {
    setSelectedGuia(null)
    setFormMode("create")
    setShowForm(true)
  }

  const handleEditGuia = (guia) => {
    setSelectedGuia(guia)
    setFormMode("edit")
    setShowForm(true)
  }

  const handleViewGuia = (guia) => {
    setSelectedGuia(guia)
    setShowDetail(true)
  }

  const handleToggleStatus = async (guia) => {
    try {
      await guiasAPI.updateGuia(guia.id_guia, { activo: !guia.activo })
      await loadGuias()
    } catch (error) {
      setError(error.message || "Error al cambiar estado del guía")
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    loadGuias()
  }

  const getInitials = (nombre, apellido) =>
    `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Guías
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {pagination.totalItems} guías encontradas
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateGuia}>
          Nuevo Guía
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterIcon /> Filtros
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar guías"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
          </Grid2>
          <Grid2 item xs={12} md={4}>
            <TextField
              fullWidth
              label="Especialidad"
              value={filters.especialidad}
              onChange={(e) => handleFilterChange("especialidad", e.target.value)}
              placeholder="Ej: montañismo, trekking"
            />
          </Grid2>
          <Grid2 item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.disponible}
                label="Estado"
                onChange={(e) => handleFilterChange("disponible", e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
      </Card>

      {/* Lista de guías */}
      {loading ? (
        <Grid2 container spacing={3}>
          {Array.from({ length: pagination.itemsPerPage }).map((_, i) => (
            <Grid2 item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Grid2 container spacing={4}>
          {guias.map((guia) => (
            <Grid2 item xs={12} sm={6} md={4} key={guia.id_guia}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 150 }}>
                <Card elevation={3} sx={{ borderRadius: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2, bgcolor: guia.activo ? "success.main" : "grey.400" }}>
                        {getInitials(guia.usuario?.nombre, guia.usuario?.apellido)}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6">
                          {guia.usuario?.nombre} {guia.usuario?.apellido}
                        </Typography>
                        <Rating
                          value={guia.calificacion_promedio || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Chip
                        label={guia.activo ? "Activo" : "Inactivo"}
                        color={guia.activo ? "success" : "default"}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Especialidades:</strong> {guia.especialidades || "No especificadas"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Experiencia:</strong> {guia.anos_experiencia || 0} {guia.anos_experiencia === 1 ? "año" : "años"}
                    </Typography>
                    {guia.idiomas && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Idiomas:</strong> {guia.idiomas}
                      </Typography>
                    )}
                    {guia.tarifa_por_dia && (
                      <Typography variant="body2" color="primary.main">
                        <strong>Tarifa:</strong> ${guia.tarifa_por_dia}/día
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Tooltip title="Ver detalles">
                      <IconButton onClick={() => handleViewGuia(guia)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditGuia(guia)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={guia.activo ? "Desactivar" : "Activar"}>
                      <IconButton onClick={() => handleToggleStatus(guia)}>
                        {guia.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid2>
          ))}
        </Grid2>
      )}

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

      {/* Modal de formulario */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{formMode === "create" ? "Crear Nuevo Guía" : "Editar Guía"}</DialogTitle>
        <DialogContent>
          <GuiaForm guia={selectedGuia} mode={formMode} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal de detalle */}
      <Dialog open={showDetail} onClose={() => setShowDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Guía</DialogTitle>
        <DialogContent>
          <GuiaDetail guia={selectedGuia} onEdit={() => handleEditGuia(selectedGuia)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
