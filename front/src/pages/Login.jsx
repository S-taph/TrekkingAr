"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Stack,
  Snackbar,
} from "@mui/material"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      let result
      if (isRegister) {
        result = await register(formData)
        if (result.success) {
          setSuccess("Cuenta creada con éxito. Serás redirigido al inicio...")
          setOpenSnackbar(true)

          // Redirigir automáticamente después de 3 segundos
          setTimeout(() => {
            navigate("/")
          }, 3000)
        } else {
          setError(result.error || "Error al crear la cuenta")
        }
      } else {
        result = await login({
          email: formData.email,
          password: formData.password,
        })
        if (result.success) {
          navigate("/")
        } else {
          setError(result.error || "Credenciales incorrectas")
        }
      }
    } catch {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src="/mountain.png"
              alt="Logo TrekkingAr"
              sx={{ height: 60, mb: 2 }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRegister
                ? "Regístrate para comenzar tu aventura"
                : "Accede a tu cuenta de TrekkingAr"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {isRegister && (
                <>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </>
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={isRegister ? <PersonAddIcon /> : <LoginIcon />}
                sx={{ mt: 2 }}
              >
                {loading
                  ? "Procesando..."
                  : isRegister
                  ? "Registrarse"
                  : "Iniciar Sesión"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
              <Link
                component="button"
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError("")
                  setSuccess("")
                }}
                sx={{ cursor: "pointer" }}
              >
                {isRegister ? "Inicia sesión" : "Regístrate"}
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Snackbar para feedback */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={() => setOpenSnackbar(false)}
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}
