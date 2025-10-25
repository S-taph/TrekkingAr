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
  Divider,
} from "@mui/material"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import GoogleIcon from "@mui/icons-material/Google"
import HomeIcon from "@mui/icons-material/Home"
import IconButton from "@mui/material/IconButton"

export default function Login() {
  const navigate = useNavigate()
  const { login, register, user } = useAuth()
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
          // Esperar un momento para que el estado se actualice
          setTimeout(() => {
            // Redirigir según el rol del usuario
            if (result.user?.rol === "admin") {
              navigate("/admin")
            } else {
              navigate("/")
            }
          }, 100)
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

  const handleGoogleLogin = () => {
    // Redirigir al endpoint de autenticación de Google en el backend
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api"
    window.location.href = `${API_BASE_URL.replace('/api', '')}/api/auth/google`
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        position: "relative",
      }}
    >
      {/* Botón Volver a Home */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "white",
          bgcolor: "rgba(255, 255, 255, 0.2)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.3)",
          },
        }}
        aria-label="Volver al inicio"
      >
        <HomeIcon />
      </IconButton>

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

          {/* Divisor con texto "O" */}
          {!isRegister && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  O
                </Typography>
              </Divider>

              {/* Botón de Google */}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: "#4285f4",
                  color: "#4285f4",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#357ae8",
                    backgroundColor: "rgba(66, 133, 244, 0.04)",
                  },
                }}
              >
                Continuar con Google
              </Button>
            </>
          )}

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
