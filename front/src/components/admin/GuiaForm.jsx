"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material"
import { guiasAPI } from "../../services/api"

export default function GuiaForm({ guia, mode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id_usuario: "",
    especialidades: "",
    experiencia_anos: "",
    certificaciones: "",
    idiomas: "",
    tarifa_por_dia: "",
    disponible: true,
    activo: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock de usuarios con rol guía (en un caso real vendría de la API)
  const [usuarios] = useState([
    { id_usuarios: 1, nombre: "Carlos", apellido: "Mendez", email: "carlos@example.com" },
    { id_usuarios: 2, nombre: "Ana", apellido: "Rodriguez", email: "ana@example.com" },
    { id_usuarios: 3, nombre: "Miguel", apellido: "Torres", email: "miguel@example.com" },
  ])

  useEffect(() => {
    if (mode === "edit" && guia) {
      setFormData({
        id_usuario: guia.id_usuario || "",
        especialidades: guia.especialidades || "",
        experiencia_anos: guia.experiencia_anos || "",
        certificaciones: guia.certificaciones || "",
        idiomas: guia.idiomas || "",
        tarifa_por_dia: guia.tarifa_por_dia || "",
        disponible: guia.disponible !== undefined ? guia.disponible : true,
        activo: guia.activo !== undefined ? guia.activo : true,
      })
    }
  }, [guia, mode])

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
        id_usuario: Number.parseInt(formData.id_usuario),
        especialidades: formData.especialidades,
        anos_experiencia: Number.parseInt(formData.experiencia_anos) || 0, // Backend espera anos_experiencia
        certificaciones: formData.certificaciones,
        idiomas: formData.idiomas,
        tarifa_por_dia: formData.tarifa_por_dia ? Number.parseFloat(formData.tarifa_por_dia) : 0,
        disponible: formData.disponible,
      }

      console.log("[v0] Enviando datos:", submitData) // Debug

      if (mode === "create") {
        const response = await guiasAPI.createGuia(submitData)
        console.log("[v0] Respuesta del servidor:", response) // Debug
      } else {
        await guiasAPI.updateGuia(guia.id_guia, submitData)
      }

      onSuccess()
    } catch (error) {
      console.error("[v0] Error al crear guía:", error) // Debug
      setError(error.message || "Error al guardar el guía")
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

      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
        </Grid>

        {mode === "create" && (
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Usuario</InputLabel>
              <Select name="id_usuario" value={formData.id_usuario} label="Usuario" onChange={handleChange}>
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id_usuarios} value={usuario.id_usuarios}>
                    {usuario.nombre} {usuario.apellido} ({usuario.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="especialidades"
            label="Especialidades"
            value={formData.especialidades}
            onChange={handleChange}
            helperText="Ej: Montañismo, Trekking, Escalada (separadas por comas)"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="number"
            name="experiencia_anos"
            label="Años de Experiencia"
            value={formData.experiencia_anos}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">años</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            name="tarifa_por_dia"
            label="Tarifa por Día"
            value={formData.tarifa_por_dia}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="idiomas"
            label="Idiomas"
            value={formData.idiomas}
            onChange={handleChange}
            helperText="Ej: Español, Inglés, Francés (separados por comas)"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="certificaciones"
            label="Certificaciones"
            value={formData.certificaciones}
            onChange={handleChange}
            helperText="Certificaciones, cursos y títulos relevantes"
          />
        </Grid>

        {/* Estados */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Estado
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Disponible</InputLabel>
            <Select name="disponible" value={formData.disponible} label="Disponible" onChange={handleChange}>
              <MenuItem value={true}>Disponible</MenuItem>
              <MenuItem value={false}>No Disponible</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select name="activo" value={formData.activo} label="Estado" onChange={handleChange}>
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Botones */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : mode === "create" ? "Crear Guía" : "Actualizar Guía"}
        </Button>
      </Box>
    </Box>
  )
}
