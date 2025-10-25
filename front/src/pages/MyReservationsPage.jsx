import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Event, Person, AttachMoney, Cancel } from "@mui/icons-material"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { reservasAPI } from "../services/api"

const estadoColors = {
  pendiente: "warning",
  confirmada: "success",
  cancelada: "error",
  completada: "info",
}

/**
 * MyReservationsPage - Página de mis reservas
 * ✅ Conectado con backend real
 */
export default function MyReservationsPage() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = "Mis Reservas - TrekkingAR"
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      // ✅ Conectado con GET /api/reservas/mis-reservas
      const response = await reservasAPI.getMisReservas()

      if (response.success) {
        setReservations(response.data.reservas || [])
      }
    } catch (error) {
      console.error("Error cargando reservas:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) return

    try {
      // ✅ Conectado con PUT /api/reservas/:id/cancelar
      const response = await reservasAPI.cancelReserva(id)

      if (response.success) {
        // Recargar reservas para reflejar el cambio
        await loadReservations()
      }
    } catch (error) {
      console.error("Error cancelando reserva:", error)
      setError(error.message)
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Mis Reservas
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Historial de reservas y próximos viajes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : reservations.length === 0 ? (
          <Alert severity="info">
            No tienes reservas aún. Explora nuestro catálogo para comenzar tu aventura.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {reservations.map((reservation) => (
              <Grid item xs={12} md={6} key={reservation.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {reservation.viaje.titulo}
                      </Typography>
                      <Chip
                        label={reservation.estado}
                        color={estadoColors[reservation.estado]}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Número de reserva: {reservation.numero_reserva}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Event fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(reservation.fecha_viaje.fecha_inicio).toLocaleDateString()} -{" "}
                        {new Date(reservation.fecha_viaje.fecha_fin).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">
                        {reservation.cantidad_personas}{" "}
                        {reservation.cantidad_personas === 1 ? "persona" : "personas"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${reservation.precio_total.toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Button size="small" variant="outlined">
                      Ver Detalles
                    </Button>
                    {reservation.estado === "confirmada" && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleCancel(reservation.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
