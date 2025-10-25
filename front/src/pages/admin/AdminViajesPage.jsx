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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Add, Edit, Delete, Visibility } from "@mui/icons-material"
import { viajesAPI } from "../../services/api"

/**
 * AdminViajesPage - CRUD de viajes para admin
 */
export default function AdminViajesPage() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingViaje, setEditingViaje] = useState(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    destino: "",
    duracion_dias: 1,
    dificultad: "moderada",
    precio_base: 0,
    categoria: "",
  })

  useEffect(() => {
    loadViajes()
  }, [])

  const loadViajes = async () => {
    try {
      setLoading(true)
      const response = await viajesAPI.getViajes({ limit: 100 })
      if (response.success) {
        setViajes(response.data.viajes || [])
      }
    } catch (error) {
      console.error("Error cargando viajes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingViaje(null)
    setFormData({
      titulo: "",
      descripcion: "",
      destino: "",
      duracion_dias: 1,
      dificultad: "moderada",
      precio_base: 0,
      categoria: "",
    })
    setDialogOpen(true)
  }

  const handleEdit = (viaje) => {
    setEditingViaje(viaje)
    setFormData({
      titulo: viaje.titulo || "",
      descripcion: viaje.descripcion || "",
      destino: viaje.destino || "",
      duracion_dias: viaje.duracion_dias || 1,
      dificultad: viaje.dificultad || "moderada",
      precio_base: viaje.precio_base || 0,
      categoria: viaje.categoria || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este viaje?")) return

    try {
      // TODO: Integrar con DELETE /api/viajes/:id
      await viajesAPI.deleteViaje(id)
      loadViajes()
    } catch (error) {
      console.error("Error eliminando viaje:", error)
    }
  }

  const handleSave = async () => {
    try {
      if (editingViaje) {
        // TODO: Integrar con PUT /api/viajes/:id
        await viajesAPI.updateViaje(editingViaje.id, formData)
      } else {
        // TODO: Integrar con POST /api/viajes
        await viajesAPI.createViaje(formData)
      }
      setDialogOpen(false)
      loadViajes()
    } catch (error) {
      console.error("Error guardando viaje:", error)
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Gestión de Viajes
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nuevo Viaje
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Dificultad</TableCell>
              <TableCell>Precio Base</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viajes.map((viaje) => (
              <TableRow key={viaje.id}>
                <TableCell>{viaje.titulo}</TableCell>
                <TableCell>{viaje.destino}</TableCell>
                <TableCell>{viaje.duracion_dias} días</TableCell>
                <TableCell>
                  <Chip label={viaje.dificultad} size="small" />
                </TableCell>
                <TableCell>${viaje.precio_base?.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(viaje)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(viaje.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingViaje ? "Editar Viaje" : "Nuevo Viaje"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Destino"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duración (días)"
                value={formData.duracion_dias}
                onChange={(e) => setFormData({ ...formData, duracion_dias: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={formData.dificultad}
                  label="Dificultad"
                  onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                >
                  <MenuItem value="facil">Fácil</MenuItem>
                  <MenuItem value="moderada">Moderada</MenuItem>
                  <MenuItem value="dificil">Difícil</MenuItem>
                  <MenuItem value="extrema">Extrema</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Precio Base"
                value={formData.precio_base}
                onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
