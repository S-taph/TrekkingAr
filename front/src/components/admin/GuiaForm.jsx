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
  Grid2,
  MenuItem,
} from "@mui/material"
import { guiasAPI, usuariosAPI } from "../../services/api"

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
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async (search = "") => {
    setLoadingUsuarios(true)
    try {
      const response = await usuariosAPI.getUsuarios({
        search,
        limit: 50, // Increase limit for better search results
      })
      console.log("[v0] Usuarios cargados:", response)
      setUsuarios(response.data?.usuarios || response.data || response)
    } catch (error) {
      console.error("Error cargando usuarios:", error)
      setUsuarios([])
    } finally {
      setLoadingUsuarios(false)
    }
  }

  // Buscar usuarios con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchUsuarios(searchTerm)
      } else {
        fetchUsuarios()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

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

      // Si está en modo edición, cargar el usuario actual
      if (guia.id_usuario && guia.usuario) {
        setUsuarios([guia.usuario])
      }
    }
  }, [guia, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserSelect = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      id_usuario: value ? value.id_usuarios : "",
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
        anos_experiencia: Number.parseInt(formData.experiencia_anos) || 0,
        certificaciones: formData.certificaciones,
        idiomas: formData.idiomas,
        tarifa_por_dia: formData.tarifa_por_dia ? Number.parseFloat(formData.tarifa_por_dia) : 0,
        disponible: formData.disponible,
      }

      if (mode === "create") {
        await guiasAPI.createGuia(submitData)
      } else {
        await guiasAPI.updateGuia(guia.id_guia, submitData)
      }

      onSuccess()
    } catch (error) {
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

      <Grid2 container spacing={3}>
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
        </Grid2>

        {mode === "create" && (
          <Grid2 item xs={12}>
            <Autocomplete
              options={usuarios}
              getOptionLabel={(option) =>
                `${option.nombre} ${option.apellido} (${option.email})${option.dni ? ` - DNI: ${option.dni}` : ""}`
              }
              value={usuarios.find((user) => user.id_usuarios === formData.id_usuario) || null}
              onChange={handleUserSelect}
              onInputChange={(event, newInputValue) => {
                setSearchTerm(newInputValue)
              }}
              loading={loadingUsuarios}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar usuario para convertir en guía"
                  placeholder="Escribe nombre, apellido o email..."
                  helperText="Busca entre todos los usuarios registrados para asignar como guía"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">
                      {option.nombre} {option.apellido}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.email} {option.dni && `• DNI: ${option.dni}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="No se encontraron usuarios"
              filterOptions={(x) => x} // Disable client-side filtering since we do server-side search
            />
          </Grid2>
        )}

        {mode === "edit" && (
          <Grid2 item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Editando guía: {guia?.usuario?.nombre} {guia?.usuario?.apellido} ({guia?.usuario?.email})
            </Alert>
          </Grid2>
        )}

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            required
            name="especialidades"
            label="Especialidades"
            value={formData.especialidades}
            onChange={handleChange}
            helperText="Ej: Montañismo, Trekking, Escalada (separadas por comas)"
          />
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="number"
            name="experiencia_anos"
            label="Años de Experiencia"
            value={formData.experiencia_anos}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            name="tarifa_por_dia"
            label="Tarifa por Día"
            value={formData.tarifa_por_dia}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            name="idiomas"
            label="Idiomas"
            value={formData.idiomas}
            onChange={handleChange}
            helperText="Ej: Español, Inglés, Francés (separados por comas)"
          />
        </Grid2>

        <Grid2 item xs={12}>
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
        </Grid2>

        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Estado
          </Typography>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            select
            name="disponible"
            label="Disponible"
            value={formData.disponible}
            onChange={handleChange}
          >
            <MenuItem value={true}>Disponible</MenuItem>
            <MenuItem value={false}>No Disponible</MenuItem>
          </TextField>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField fullWidth select name="activo" label="Estado" value={formData.activo} onChange={handleChange}>
            <MenuItem value={true}>Activo</MenuItem>
            <MenuItem value={false}>Inactivo</MenuItem>
          </TextField>
        </Grid2>
      </Grid2>

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
