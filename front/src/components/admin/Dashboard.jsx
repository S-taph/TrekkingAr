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
} from "@mui/material"
import {
  People as PeopleIcon,
  Hiking as HikingIcon,
  PersonPin as GuideIcon,
  BookOnline as ReservasIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { viajesAPI, reservasAPI, guiasAPI } from "../../services/api"

const StatCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        p: 1,
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="subtitle1">
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ color: "#2196f3", fontWeight: "bold" }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              color: "#2196f3",
              bgcolor: "rgba(33,150,243,0.1)",
              p: 1,
              borderRadius: "50%",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
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

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [viajesResponse, reservasResponse, guiasResponse] = await Promise.all([
        viajesAPI.getViajes().catch(() => ({ data: { viajes: [] } })),
        reservasAPI.getReservas().catch(() => ({ data: { reservas: [] } })),
        guiasAPI.getGuias().catch(() => ({ data: { guias: [] } })),
      ])

      const viajes = viajesResponse.data?.viajes || []
      const reservas = reservasResponse.data?.reservas || []
      const guias = guiasResponse.data?.guias || []

      const estadisticas = {
        totalUsuarios: 0,
        totalViajes: viajes.length,
        totalGuias: guias.length,
        totalReservas: reservas.length,
        ingresosMes: reservas.reduce((total, reserva) => {
          if (["confirmada", "completada"].includes(reserva.estado_reserva)) {
            return total + (reserva.precio_unitario * reserva.cantidad_personas || 0)
          }
          return total
        }, 0),
      }

      const reservasPorEstado = ["pendiente", "confirmada", "cancelada", "completada"].map(
        (estado) => ({
          estado,
          cantidad: reservas.filter((r) => r.estado_reserva === estado).length,
        })
      )

      const proximasSalidas = viajes.slice(0, 5).map((viaje) => ({
        viaje: { titulo: viaje.titulo, dificultad: viaje.dificultad },
        fecha_salida: new Date(
          Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
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
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: "#2196f3" }} />
      </Box>
    )

  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadDashboardData} sx={{ ml: 2, color: "#2196f3" }}>
          Reintentar
        </Button>
      </Alert>
    )

  const { estadisticas, reservasPorEstado, proximasSalidas } = dashboardData || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#2196f3", fontWeight: "bold" }}
        >
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Resumen general del sistema
        </Typography>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Usuarios"
              value={estadisticas?.totalUsuarios || 0}
              icon={<PeopleIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Viajes Activos"
              value={estadisticas?.totalViajes || 0}
              icon={<HikingIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Guías Activos"
              value={estadisticas?.totalGuias || 0}
              icon={<GuideIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reservas"
              value={estadisticas?.totalReservas || 0}
              icon={<ReservasIcon fontSize="large" />}
            />
          </Grid>
        </Grid>

        {/* Ingresos y reservas */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{ borderRadius: 3, p: 1, backgroundColor: "#fff" }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MoneyIcon sx={{ color: "#2196f3", mr: 1 }} />
                  <Typography variant="h6">Ingresos del Mes</Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{ color: "#2196f3", fontWeight: "bold" }}
                >
                  {formatCurrency(estadisticas?.ingresosMes || 0)}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUpIcon
                    sx={{ color: "#2196f3", mr: 0.5 }}
                    fontSize="small"
                  />
                  <Typography variant="body2" sx={{ color: "#2196f3" }}>
                    Mes actual
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reservas por Estado
                </Typography>
                <List dense>
                  {reservasPorEstado?.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body1"
                              sx={{ textTransform: "capitalize" }}
                            >
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
          </Grid>

          {/* Próximas salidas */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#fff",
              }}
            >
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
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "medium" }}
                              >
                                {salida.viaje?.titulo}
                              </Typography>
                              <Box display="flex" gap={1} alignItems="center">
                                <Chip
                                  label={salida.viaje?.dificultad}
                                  color={getDificultadColor(
                                    salida.viaje?.dificultad
                                  )}
                                  size="small"
                                  sx={{ textTransform: "capitalize" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {formatDate(salida.fecha_salida)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box mt={1}>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                              >
                                Cupos: {salida.cupos_ocupados || 0}/
                                {salida.cupos_maximos || 0} •{" "}
                                {salida.duracion_dias} días
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
                <Typography color="textSecondary">
                  No hay salidas programadas para los próximos 7 días
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Acciones rápidas */}
        <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                label: "Nuevo Viaje",
                icon: <HikingIcon />,
                route: "/admin/viajes",
              },
              {
                label: "Nuevo Guía",
                icon: <GuideIcon />,
                route: "/admin/guias",
              },
              {
                label: "Ver Reservas",
                icon: <ReservasIcon />,
                route: "/admin/reservas",
              },
              {
                label: "Gestionar Usuarios",
                icon: <PeopleIcon />,
                route: "/admin/usuarios",
              },
            ].map((btn, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={btn.icon}
                    sx={{
                      color: "#2196f3",
                      borderColor: "#2196f3",
                      fontWeight: 500,
                    }}
                    onClick={() => onNavigate(btn.route)}
                  >
                    {btn.label}
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </motion.div>
  )
}
