import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  IconButton,
  Stack,
} from "@mui/material"
import { PhotoCamera, Save } from "@mui/icons-material"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { usuariosAPI } from "../services/api"

/**
 * ProfilePage - Página de perfil de usuario
 * ✅ Conectado con backend real
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = "Mi Perfil - TrekkingAR"
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        dni: user.dni || "",
      })
    }
  }, [user])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)

    try {
      // ✅ Conectado con PUT /api/usuarios/:id
      const response = await usuariosAPI.updateUsuario(user.id_usuarios, formData)

      if (response.success) {
        // Si hay un avatar nuevo, subirlo
        if (avatarFile) {
          const avatarResponse = await usuariosAPI.uploadAvatar(user.id_usuarios, avatarFile)
          if (avatarResponse.success) {
            // Actualizar el contexto con el nuevo avatar
            updateUser({ ...user, ...formData, avatar_url: avatarResponse.data.avatarUrl })
          }
        } else {
          // Solo actualizar los datos del usuario
          updateUser({ ...user, ...formData })
        }

        setSuccess(true)
        setAvatarFile(null)
        setAvatarPreview(null)
      }
    } catch (error) {
      console.error("Error guardando perfil:", error)
      setError(error.message || "Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Mi Perfil
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            Perfil actualizado correctamente
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Avatar */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={avatarPreview || user?.avatar}
                  sx={{ width: 120, height: 120 }}
                >
                  {user?.nombre?.charAt(0)}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <PhotoCamera />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Campos del formulario */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={formData.dni}
                  onChange={(e) => handleChange("dni", e.target.value)}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button variant="outlined" size="large">
                Cambiar Contraseña
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}
