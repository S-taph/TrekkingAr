"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Grid,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import { guiasAPI, usuariosAPI } from "../../services/api"

export default function GuiaForm({ guia, mode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id_usuario: "",
    matricula: "",
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
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch initial users
  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async (search = "") => {
    setLoadingUsuarios(true)
    try {
      const response = await usuariosAPI.getUsuarios({ search, limit: 50 })
      setUsuarios(response.data?.usuarios || response.data || response)
    } catch (err) {
      console.error("Error cargando usuarios:", err)
      setUsuarios([])
    } finally {
      setLoadingUsuarios(false)
    }
  }

  useEffect(() => {
    if (selectedUser) return
    const timer = setTimeout(() => {
      fetchUsuarios(searchTerm.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedUser])

  useEffect(() => {
    if (mode === "edit" && guia) {
      setFormData({
        id_usuario: guia.id_usuario || "",
        matricula: guia.matricula || "",
        especialidades: guia.especialidades || "",
        experiencia_anos: guia.experiencia_anos || "",
        certificaciones: guia.certificaciones || "",
        idiomas: guia.idiomas || "",
        tarifa_por_dia: guia.tarifa_por_dia || "",
        disponible: guia.disponible ?? true,
        activo: guia.activo ?? true,
      })
      if (guia.id_usuario && guia.usuario) {
        setUsuarios([guia.usuario])
        setSelectedUser(guia.usuario)
      }
    }
  }, [guia, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserSelect = (event, value) => {
    setSelectedUser(value)
    setFormData((prev) => ({ ...prev, id_usuario: value ? value.id_usuarios : "" }))
    if (value) setSearchTerm("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "create" && !selectedUser) {
        setError("Debe seleccionar un usuario para crear el perfil de guía")
        setLoading(false)
        return
      }
      if (!formData.matricula.trim()) {
        setError("La matrícula es requerida")
        setLoading(false)
        return
      }
      if (!formData.especialidades.trim()) {
        setError("Las especialidades son requeridas")
        setLoading(false)
        return
      }
      if (!formData.experiencia_anos || formData.experiencia_anos < 0) {
        setError("Los años de experiencia deben ser un número positivo")
        setLoading(false)
        return
      }

      const submitData = {
        id_usuario: Number.parseInt(formData.id_usuario),
        matricula: formData.matricula.trim(),
        especialidades: formData.especialidades.trim(),
        anos_experiencia: Number.parseInt(formData.experiencia_anos),
        certificaciones: formData.certificaciones.trim(),
        idiomas: formData.idiomas.trim(),
        tarifa_por_dia: formData.tarifa_por_dia ? Number.parseFloat(formData.tarifa_por_dia) : 0,
        disponible: formData.disponible,
        activo: formData.activo,
      }

      if (mode === "create") await guiasAPI.createGuia(submitData)
      else await guiasAPI.updateGuia(guia.id_guia, submitData)

      onSuccess()
    } catch (err) {
      console.error(err)
      setError(err.message || "Error al guardar el guía")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Usuario */}
      <Card sx={{ p: 3, mb: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontWeight: 600 }}>
          Información Básica del Usuario
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {mode === "create" && (
          <Autocomplete
            options={usuarios}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido} (${option.email})`}
            value={selectedUser}
            onChange={handleUserSelect}
            onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
            loading={loadingUsuarios}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar usuario"
                placeholder="Nombre, apellido o email"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingUsuarios && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ mb: 2 }}
          />
        )}

        {selectedUser && mode === "create" && (
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: "#e3f2fd" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: "#1976d2" }}>
              Usuario Seleccionado
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Nombre Completo:</Typography>
                <Typography variant="body1">{selectedUser.nombre} {selectedUser.apellido}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Email:</Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Grid>
            </Grid>
            <Button
              size="small"
              sx={{ mt: 2 }}
              onClick={() => { setSelectedUser(null); setFormData(prev => ({ ...prev, id_usuario: "" })) }}
              color="secondary"
            >
              Cambiar Usuario
            </Button>
          </Card>
        )}
      </Card>

      {/* Guía */}
      <Card sx={{ p: 3, mb: 3, backgroundColor: "#fffde7" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#f57c00", fontWeight: 600 }}>
          Información del Guía
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Matrícula Profesional"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Especialidades"
              name="especialidades"
              value={formData.especialidades}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Años de Experiencia"
              type="number"
              name="experiencia_anos"
              value={formData.experiencia_anos}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tarifa por Día"
              type="number"
              name="tarifa_por_dia"
              value={formData.tarifa_por_dia}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Certificaciones"
              name="certificaciones"
              value={formData.certificaciones}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Idiomas"
              name="idiomas"
              value={formData.idiomas}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="Disponible" name="disponible" value={formData.disponible} onChange={handleChange} fullWidth>
              <MenuItem value={true}>Disponible</MenuItem>
              <MenuItem value={false}>No Disponible</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="Activo" name="activo" value={formData.activo} onChange={handleChange} fullWidth>
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Botones */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel} disabled={loading} color="secondary">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading} color="primary">
          {loading ? <CircularProgress size={24} /> : mode === "create" ? "Crear Guía" : "Actualizar Guía"}
        </Button>
      </Box>
    </Box>
  )
}
