"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  TextField,
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

export default function Dashboard({ onNavigate }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Inicializar con el mes actual por defecto
  const getDefaultDateRange = () => {
    const now = new Date()
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1)
    const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
      fecha_desde: primerDiaMes.toISOString().split('T')[0],
      fecha_hasta: ultimoDiaMes.toISOString().split('T')[0],
    }
  }

  const [dateRange, setDateRange] = useState(getDefaultDateRange())

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [viajesResponse, reservasResponse, guiasResponse] = await Promise.all([
        viajesAPI.getViajes().catch(() => ({ data: { viajes: [] } })),
        reservasAPI.getReservas({ limit: 1000 }).catch(() => ({ data: { reservas: [] } })),
        guiasAPI.getGuias().catch(() => ({ data: { guias: [] } })),
      ])

      const viajes = viajesResponse.data?.viajes || []
      let reservas = reservasResponse.data?.reservas || []
      const guias = guiasResponse.data?.guias || []

      // Filtrar reservas por rango de fechas si se especifica
      if (dateRange.fecha_desde || dateRange.fecha_hasta) {
        reservas = reservas.filter((reserva) => {
          const fechaReserva = new Date(reserva.fecha_reserva)
          const desde = dateRange.fecha_desde ? new Date(dateRange.fecha_desde) : null
          const hasta = dateRange.fecha_hasta ? new Date(dateRange.fecha_hasta) : null

          if (desde && fechaReserva < desde) return false
          if (hasta) {
            // Agregar 23:59:59 al día final
            const hastaFinal = new Date(hasta)
            hastaFinal.setHours(23, 59, 59, 999)
            if (fechaReserva > hastaFinal) return false
          }
          return true
        })
      }

      // Calcular ingresos basándose en compras únicas
      const comprasUnicas = new Map()
      reservas.forEach((reserva) => {
        if (["confirmada", "completada"].includes(reserva.estado_reserva) && reserva.compra) {
          const compraId = reserva.compra.id_compras
          const totalCompra = Number(reserva.compra.total_compra) || 0
          if (!comprasUnicas.has(compraId)) {
            comprasUnicas.set(compraId, totalCompra)
          }
        }
      })
      const ingresosMes = Array.from(comprasUnicas.values()).reduce((sum, total) => sum + total, 0)

      const estadisticas = {
        totalUsuarios: 0,
        totalViajes: viajes.length,
        totalGuias: guias.length,
        totalReservas: reservas.length,
        ingresosMes,
      }

      const reservasPorEstado = ["pendiente", "confirmada", "cancelada", "completada"].map((estado) => ({
        estado,
        cantidad: reservas.filter((r) => r.estado_reserva === estado).length,
      }))

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

      setDashboardData({ estadisticas, reservasPorEstado, proximasSalidas })
    } catch (err) {
      setError(err.message || "Error al cargar datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress sx={{ color: "#64b5f6" }} /></Box>

  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadDashboardData} sx={{ ml: 2, color: "#64b5f6" }}>
          Reintentar
        </Button>
      </Alert>
    )

  const { estadisticas, reservasPorEstado, proximasSalidas } = dashboardData || {}

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: "#64b5f6" }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Resumen general del sistema
      </Typography>

      {/* Filtros de fecha */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Filtrar por rango de fechas
            </Typography>
            <Chip
              label={dateRange.fecha_desde && dateRange.fecha_hasta ? "Mes actual" : "Todo el histórico"}
              color={dateRange.fecha_desde && dateRange.fecha_hasta ? "primary" : "default"}
              size="small"
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fecha desde"
                type="date"
                value={dateRange.fecha_desde}
                onChange={(e) => setDateRange({ ...dateRange, fecha_desde: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fecha hasta"
                type="date"
                value={dateRange.fecha_hasta}
                onChange={(e) => setDateRange({ ...dateRange, fecha_hasta: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" gap={1} height="100%">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setDateRange({ fecha_desde: "", fecha_hasta: "" })}
                  sx={{ height: "56px", color: "#64b5f6", borderColor: "#64b5f6" }}
                >
                  Ver todo
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setDateRange(getDefaultDateRange())}
                  sx={{ height: "56px", bgcolor: "#64b5f6", minWidth: "120px" }}
                >
                  Mes actual
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Usuarios" value={estadisticas?.totalUsuarios || 0} icon={<PeopleIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Viajes Activos" value={estadisticas?.totalViajes || 0} icon={<HikingIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Guías Activos" value={estadisticas?.totalGuias || 0} icon={<GuideIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Reservas" value={estadisticas?.totalReservas || 0} icon={<ReservasIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                <Typography variant="body2" sx={{ color: "#64b5f6" }}>Mes actual</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Reservas por Estado</Typography>
              <List dense>
                {reservasPorEstado?.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" sx={{ textTransform: "capitalize" }}>{item.estado}</Typography>
                          <Chip label={item.cantidad} color={getEstadoColor(item.estado)} size="small" variant="outlined" />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Próximas Salidas (7 días)</Typography>
            {proximasSalidas?.length > 0 ? (
              <List>
                {proximasSalidas.map((salida, index) => (
                  <Box key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>{salida.viaje?.titulo}</Typography>
                            <Box display="flex" gap={1} alignItems="center">
                              <Chip label={salida.viaje?.dificultad} color={getDificultadColor(salida.viaje?.dificultad)} size="small" sx={{ textTransform: "capitalize" }} />
                              <Typography variant="body2" color="textSecondary">{formatDate(salida.fecha_salida)}</Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                              Cupos: {salida.cupos_ocupados || 0}/{salida.cupos_maximos || 0} • {salida.duracion_dias} días
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
        </Grid>
      </Grid>

      {/* Acciones rápidas */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Acciones Rápidas</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<HikingIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
              onClick={() => onNavigate("/admin/viajes")}
            >
              Nuevo Viaje
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GuideIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
              onClick={() => onNavigate("/admin/guias")}
            >
              Nuevo Guía
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ReservasIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
              onClick={() => onNavigate("/admin/reservas")}
            >
              Ver Reservas
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PeopleIcon />}
              sx={{ color: "#64b5f6", borderColor: "#64b5f6" }}
              onClick={() => onNavigate("/admin/usuarios")}
            >
              Gestionar Usuarios
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
