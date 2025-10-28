import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Add, Edit, Delete, CalendarMonth } from "@mui/icons-material"
import { viajesAPI } from "../../services/api"

/**
 * FechasViajeManager - Componente para gestionar múltiples fechas de un viaje
 */
export default function FechasViajeManager({ viajeId }) {
  const [fechas, setFechas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFecha, setEditingFecha] = useState(null)
  const [formData, setFormData] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    cupos_disponibles: 10,
    precio_fecha: "",
    estado_fecha: "disponible",
    observaciones: "",
  })

  useEffect(() => {
    if (viajeId) {
      loadFechas()
    }
  }, [viajeId])

  const loadFechas = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await viajesAPI.getFechasViaje(viajeId)
      if (response.success) {
        setFechas(response.data.fechas || [])
      }
    } catch (error) {
      console.error("Error cargando fechas:", error)
      setError(error.message || "Error al cargar las fechas")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingFecha(null)
    setFormData({
      fecha_inicio: "",
      fecha_fin: "",
      cupos_disponibles: 10,
      precio_fecha: "",
      estado_fecha: "disponible",
      observaciones: "",
    })
    setDialogOpen(true)
  }

  const handleEdit = (fecha) => {
    setEditingFecha(fecha)
    setFormData({
      fecha_inicio: fecha.fecha_inicio?.split("T")[0] || "",
      fecha_fin: fecha.fecha_fin?.split("T")[0] || "",
      cupos_disponibles: fecha.cupos_disponibles || 10,
      precio_fecha: fecha.precio_fecha || "",
      estado_fecha: fecha.estado_fecha || "disponible",
      observaciones: fecha.observaciones || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (fechaId) => {
    if (!window.confirm("¿Eliminar esta fecha de salida?")) return

    try {
      await viajesAPI.deleteFechaViaje(viajeId, fechaId)
      loadFechas()
    } catch (error) {
      console.error("Error eliminando fecha:", error)
      setError(error.message || "Error al eliminar la fecha")
    }
  }

  const handleSave = async () => {
    try {
      setError("")

      // Validaciones
      if (!formData.fecha_inicio || !formData.fecha_fin) {
        setError("Las fechas de inicio y fin son requeridas")
        return
      }

      if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
        setError("La fecha de inicio debe ser anterior a la fecha de fin")
        return
      }

      if (editingFecha) {
        await viajesAPI.updateFechaViaje(viajeId, editingFecha.id_fechas_viaje, formData)
      } else {
        await viajesAPI.createFechaViaje(viajeId, formData)
      }

      setDialogOpen(false)
      loadFechas()
    } catch (error) {
      console.error("Error guardando fecha:", error)
      setError(error.message || "Error al guardar la fecha")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEstadoChip = (estado) => {
    const config = {
      disponible: { label: "Disponible", color: "success" },
      completo: { label: "Completo", color: "warning" },
      cancelado: { label: "Cancelado", color: "error" },
    }
    const { label, color } = config[estado] || config.disponible
    return <Chip label={label} color={color} size="small" />
  }

  if (!viajeId) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Guarda el viaje primero para poder añadir fechas de salida
      </Alert>
    )
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonth color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Fechas de Salida
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate} size="medium">
          Añadir Fecha
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : fechas.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No hay fechas de salida configuradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Añade fechas para que los usuarios puedan reservar este viaje
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Cupos Disponibles</TableCell>
                <TableCell>Cupos Ocupados</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fechas.map((fecha) => (
                <TableRow key={fecha.id_fechas_viaje}>
                  <TableCell>{formatDate(fecha.fecha_inicio)}</TableCell>
                  <TableCell>{formatDate(fecha.fecha_fin)}</TableCell>
                  <TableCell>{fecha.cupos_disponibles}</TableCell>
                  <TableCell>{fecha.cupos_ocupados || 0}</TableCell>
                  <TableCell>
                    {fecha.precio_fecha ? `$${parseFloat(fecha.precio_fecha).toLocaleString()}` : "Precio base"}
                  </TableCell>
                  <TableCell>{getEstadoChip(fecha.estado_fecha)}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(fecha)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(fecha.id_fechas_viaje)}
                      color="error"
                      disabled={fecha.cupos_ocupados > 0}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para crear/editar fecha */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingFecha ? "Editar Fecha de Salida" : "Nueva Fecha de Salida"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          <Grid2 container spacing={3} sx={{ mt: 1 }}>
            <Grid2 item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_inicio"
                label="Fecha de Inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Fecha de inicio del viaje"
              />
            </Grid2>

            <Grid2 item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="fecha_fin"
                label="Fecha de Fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Fecha de finalización del viaje"
              />
            </Grid2>

            <Grid2 item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                name="cupos_disponibles"
                label="Cupos Disponibles"
                value={formData.cupos_disponibles}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                helperText="Cantidad máxima de participantes"
              />
            </Grid2>

            <Grid2 item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                name="precio_fecha"
                label="Precio Especial (Opcional)"
                value={formData.precio_fecha}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Deja vacío para usar el precio base del viaje"
              />
            </Grid2>

            <Grid2 item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select name="estado_fecha" value={formData.estado_fecha} label="Estado" onChange={handleChange}>
                  <MenuItem value="disponible">Disponible</MenuItem>
                  <MenuItem value="completo">Completo</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="observaciones"
                label="Observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                helperText="Información adicional sobre esta salida"
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingFecha ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
