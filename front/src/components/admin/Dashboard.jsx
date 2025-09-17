"use client"

import { useState, useEffect } from "react"
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
import {
  People as PeopleIcon,
  Hiking as HikingIcon,
  PersonPin as GuideIcon,
  BookOnline as ReservasIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material"
import { viajesAPI, reservasAPI, guiasAPI } from "../../services/api"

const StatCard = ({ title, value, icon }) => (
  <Card elevation={2}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ color: "#64b5f6" }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: "#64b5f6" }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
)

const getEstadoColor = (estado) => {
  switch (estado) {
    case "confirmada":
      return "success"
    case "pendiente":
      return "warning"
    case "cancelada":
      return "error"
    case "completada":
      return "info"
    default:
      return "default"
  }
}

const getDificultadColor = (dificultad) => {
  switch (dificultad) {
    case "facil":
      return "success"
    case "moderado":
      return "warning"
    case "dificil":
      return "error"
    case "extremo":
      return "error"
    default:
      return "default"
  }
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [viajesResponse, reservasResponse, guiasResponse] = await Promise.all([
        viajesAPI.getViajes().catch(() => ({ success: true, data: { viajes: [] } })),
        reservasAPI.getReservas().catch(() => ({ success: true, data: { reservas: [] } })),
        guiasAPI.getGuias().catch(() => ({ success: true, data: { guias: [] } })),
      ])

      // Procesar datos para el dashboard
      const viajes = viajesResponse.data?.viajes || []
      const reservas = reservasResponse.data?.reservas || []
      const guias = guiasResponse.data?.guias || []

      // Calcular estadísticas
      const estadisticas = {
        totalUsuarios: 0, // No tenemos endpoint de usuarios aún
        totalViajes: viajes.length,
        totalGuias: guias.length,
        totalReservas: reservas.length,
        ingresosMes: reservas.reduce((total, reserva) => {
          if (reserva.estado_reserva === "confirmada" || reserva.estado_reserva === "completada") {
            return total + (reserva.precio_unitario * reserva.cantidad_personas || 0)
          }
          return total
        }, 0),
      }

      // Reservas por estado
      const reservasPorEstado = ["pendiente", "confirmada", "cancelada", "completada"].map((estado) => ({
        estado,
        cantidad: reservas.filter((r) => r.estado_reserva === estado).length,
      }))

      // Próximas salidas (simulado por ahora)
      const proximasSalidas = viajes.slice(0, 5).map((viaje) => ({
        viaje: {
          titulo: viaje.titulo,
          dificultad: viaje.dificultad,
        },
        fecha_salida: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        cupos_ocupados: Math.floor(Math.random() * 10),
        cupos_maximos: 15,
        duracion_dias: viaje.duracion_dias,
      }))

      setDashboardData({
        estadisticas,
        reservasPorEstado,
        proximasSalidas,
      })
    } catch (error) {
      setError(error.message || "Error al cargar datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: "#64b5f6" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadDashboardData} sx={{ ml: 2, color: "#64b5f6" }}>
          Reintentar
        </Button>
      </Alert>
    )
  }

  const { estadisticas, reservasPorEstado, proximasSalidas } = dashboardData || {}

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: "#64b5f6" }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Resumen general del sistema
      </Typography>

      {/* Estadísticas principales */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Usuarios"
            value={estadisticas?.totalUsuarios || 0}
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Viajes Activos"
            value={estadisticas?.totalViajes || 0}
            icon={<HikingIcon fontSize="large" />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Guías Activos"
            value={estadisticas?.totalGuias || 0}
            icon={<GuideIcon fontSize="large" />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Reservas"
            value={estadisticas?.totalReservas || 0}
            icon={<ReservasIcon fontSize="large" />}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3}>
        {/* Ingresos del mes */}
        <Grid2 item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon sx={{ color: "#64b5f6", mr: 1 }} />
                <Typography variant="h6">Ingresos del Mes</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: "#64b5f6" }}>
                {formatCurrency(estadisticas?.ingresosMes || 0)}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ color: "#64b5f6", mr: 0.5 }} fontSize="small"/>
                <Typography variant="body2" sx={{ color: "#64b5f6" }}>
                  Mes actual
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Reservas por estado */}
        <Grid2 item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reservas por Estado
              </Typography>
              <List dense>
                {reservasPorEstado?.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                            {item.estado}
                          </Typography>
                          <Chip
                            label={item.cantidad}
                            color={getEstadoColor(item.estado)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        {/* Próximas salidas */}
        <Grid2 item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Próximas Salidas (7 días)
            </Typography>
            {proximasSalidas?.length > 0 ? (
              <List>
                {proximasSalidas.map((salida, index) => (
                  <Box key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                              {salida.viaje?.titulo}
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center">
                              <Chip
                                label={salida.viaje?.dificultad}
                                color={getDificultadColor(salida.viaje?.dificultad)}
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(salida.fecha_salida)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                              Cupos: {salida.cupos_ocupados || 0}/{salida.cupos_maximos || 0} • {salida.duracion_dias}{" "}
                              días
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < proximasSalidas.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">No hay salidas programadas para los próximos 7 días</Typography>
            )}
          </Paper>
        </Grid2>
      </Grid2>

      {/* Acciones rápidas */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<HikingIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
            >
              Nuevo Viaje
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GuideIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
            >
              Nuevo Guía
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ReservasIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
            >
              Ver Reservas
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PeopleIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
            >
              Gestionar Usuarios
            </Button>
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  )
}