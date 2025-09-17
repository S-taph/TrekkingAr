"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material"
import { viajesAPI } from "../../services/api"

export default function ViajeForm({ viaje, mode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id_categoria: "",
    titulo: "",
    descripcion_corta: "",
    descripcion_completa: "",
    dificultad: "",
    duracion_dias: "",
    precio_base: "",
    minimo_participantes: "",
    maximo_participantes: "",
    incluye: "",
    no_incluye: "",
    recomendaciones: "",
    activo: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Datos para selects
  const [categorias] = useState([
    { id_categoria: 1, nombre: "Trekking" },
    { id_categoria: 2, nombre: "Montañismo" },
    { id_categoria: 3, nombre: "Aventura" },
    { id_categoria: 4, nombre: "Expedición" },
  ])

  useEffect(() => {
    if (mode === "edit" && viaje) {
      setFormData({
        id_categoria: viaje.id_categoria || "",
        titulo: viaje.titulo || "",
        descripcion_corta: viaje.descripcion_corta || "",
        descripcion_completa: viaje.descripcion_completa || "",
        dificultad: viaje.dificultad || "",
        duracion_dias: viaje.duracion_dias || "",
        precio_base: viaje.precio_base || "",
        minimo_participantes: viaje.minimo_participantes || "",
        maximo_participantes: viaje.maximo_participantes || "",
        incluye: viaje.incluye || "",
        no_incluye: viaje.no_incluye || "",
        recomendaciones: viaje.recomendaciones || "",
        activo: viaje.activo !== undefined ? viaje.activo : true,
      })
    }
  }, [viaje, mode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitData = {
        ...formData,
        duracion_dias: Number.parseInt(formData.duracion_dias),
        precio_base: Number.parseFloat(formData.precio_base),
        minimo_participantes: formData.minimo_participantes ? Number.parseInt(formData.minimo_participantes) : null,
        maximo_participantes: formData.maximo_participantes ? Number.parseInt(formData.maximo_participantes) : null,
      }

      if (mode === "create") {
        await viajesAPI.createViaje(submitData)
      } else {
        await viajesAPI.updateViaje(viaje.id_viaje, submitData)
      }

      onSuccess()
    } catch (error) {
      setError(error.message || "Error al guardar el viaje")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid2 container spacing={3}>
        {/* Información básica */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select name="id_categoria" value={formData.id_categoria} label="Categoría" onChange={handleChange}>
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Dificultad</InputLabel>
            <Select name="dificultad" value={formData.dificultad} label="Dificultad" onChange={handleChange}>
              <MenuItem value="facil">Fácil</MenuItem>
              <MenuItem value="moderado">Moderado</MenuItem>
              <MenuItem value="dificil">Difícil</MenuItem>
              <MenuItem value="extremo">Extremo</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            required
            name="titulo"
            label="Título del Viaje"
            value={formData.titulo}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="descripcion_corta"
            label="Descripción Corta"
            value={formData.descripcion_corta}
            onChange={handleChange}
            helperText="Descripción breve que aparecerá en las tarjetas de viajes"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={5}
            name="descripcion_completa"
            label="Descripción Completa"
            value={formData.descripcion_completa}
            onChange={handleChange}
            helperText="Descripción detallada del viaje"
          />
        </Grid2>

        {/* Detalles del viaje */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Detalles del Viaje
          </Typography>
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            name="duracion_dias"
            label="Duración"
            value={formData.duracion_dias}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">días</InputAdornment>,
            }}
          />
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            name="precio_base"
            label="Precio Base"
            value={formData.precio_base}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select name="activo" value={formData.activo} label="Estado" onChange={handleChange}>
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            name="minimo_participantes"
            label="Mínimo Participantes"
            value={formData.minimo_participantes}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            name="maximo_participantes"
            label="Máximo Participantes"
            value={formData.maximo_participantes}
            onChange={handleChange}
          />
        </Grid2>

        {/* Información adicional */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Información Adicional
          </Typography>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="incluye"
            label="Qué Incluye"
            value={formData.incluye}
            onChange={handleChange}
            helperText="Servicios y elementos incluidos en el precio"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="no_incluye"
            label="Qué NO Incluye"
            value={formData.no_incluye}
            onChange={handleChange}
            helperText="Servicios y elementos NO incluidos en el precio"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="recomendaciones"
            label="Recomendaciones"
            value={formData.recomendaciones}
            onChange={handleChange}
            helperText="Recomendaciones para los participantes"
          />
        </Grid2>
      </Grid2>

      {/* Botones */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : mode === "create" ? "Crear Viaje" : "Actualizar Viaje"}
        </Button>
      </Box>
    </Box>
  )
}
