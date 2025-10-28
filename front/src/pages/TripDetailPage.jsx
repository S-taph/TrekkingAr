import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Divider,
  Rating,
} from "@mui/material"
import {
  AccessTime,
  TrendingUp,
  Place,
  CalendarToday,
  ShoppingCart,
  Share,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  Add,
  Remove,
  People,
  CheckCircle,
} from "@mui/icons-material"
import Header from "../components/Header"
import { TripGallery } from "../components/TripGallery"
import { useTrip } from "../hooks/useTrip"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

/**
 * TripDetailPage - Página de detalle de un viaje (Estilo Aventura)
 */
export default function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trip, loading, error } = useTrip(id)
  const { addItem } = useCart()
  const { user } = useAuth()

  const [selectedFecha, setSelectedFecha] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (trip) {
      document.title = `${trip.titulo} - TrekkingAR`
      // Seleccionar automáticamente la primera fecha disponible
      if (trip.fechas_disponibles?.length > 0) {
        setSelectedFecha(trip.fechas_disponibles[0].id)
      }
    }
  }, [trip])

  const handleAddToCart = async () => {
    if (!selectedFecha) return

    if (!user) {
      // Redirigir a login con retorno a esta página
      navigate("/login", { state: { from: `/viajes/${id}` } })
      return
    }

    setAddingToCart(true)
    try {
      const result = await addItem({
        id_viaje: parseInt(id),
        id_fecha_viaje: parseInt(selectedFecha),
        cantidad,
      })

      if (result.success) {
        console.log("Agregado al carrito exitosamente")
      }
    } catch (err) {
      console.error("Error al agregar al carrito:", err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.titulo,
        text: trip.descripcion_corta,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      console.log("URL copiada al portapapeles")
    }
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Container>
      </Box>
    )
  }

  if (error || !trip) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">
            {error || "No se pudo cargar el viaje. Intenta de nuevo más tarde."}
          </Alert>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/catalogo")} sx={{ mt: 2 }}>
            Volver al catálogo
          </Button>
        </Container>
      </Box>
    )
  }

  const selectedFechaData = trip.fechas_disponibles?.find(
    (f) => f.id === parseInt(selectedFecha),
  )
  const precioFinal = selectedFechaData?.precio || trip.precio_base

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
            Inicio
          </Link>
          <Link underline="hover" color="inherit" onClick={() => navigate("/catalogo")} sx={{ cursor: "pointer" }}>
            Catálogo
          </Link>
          <Typography color="text.primary">{trip.titulo}</Typography>
        </Breadcrumbs>

        {/* LAYOUT DE 2 COLUMNAS PRINCIPAL */}
        <Grid container spacing={4}>
          {/* COLUMNA IZQUIERDA: Galería (40%) */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2 }}>
              <TripGallery
                images={
                  trip.imagenes?.map(img => typeof img === 'string' ? img : img.url).filter(Boolean) ||
                  (trip.imagen_principal_url ? [trip.imagen_principal_url] : [])
                }
              />
            </Paper>
          </Grid>

          {/* COLUMNA DERECHA: Info Principal + Booking (60%) */}
          <Grid item xs={12} md={7}>
            {/* Título y acciones */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "text.primary"
                  }}
                >
                  {trip.titulo}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                  >
                    {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                  >
                    <Share />
                  </IconButton>
                </Stack>
              </Box>

              {/* Ubicación */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Place fontSize="small" color="action" />
                <Typography variant="body1" color="text.secondary">
                  {trip.destino}
                </Typography>
              </Stack>

              {/* Características clave con iconos */}
              <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
                <Chip
                  icon={<AccessTime />}
                  label={`${trip.duracion_dias} días`}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label={trip.dificultad}
                  color={
                    trip.dificultad === "facil"
                      ? "success"
                      : trip.dificultad === "moderada"
                        ? "warning"
                        : "error"
                  }
                  sx={{ fontWeight: 600 }}
                />
                {trip.categoria && (
                  <Chip
                    label={trip.categoria.nombre || trip.categoria}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>
            </Box>

            {/* CARD DE RESERVA */}
            <Paper
              elevation={4}
              sx={{
                p: 3,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
              }}
            >
              {/* Precio grande */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
                  ${precioFinal?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Por persona
                </Typography>
              </Box>

              {/* Selector de fecha */}
              {trip.fechas_disponibles && trip.fechas_disponibles.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Fecha de salida
                  </Typography>
                  <Stack spacing={1}>
                    {trip.fechas_disponibles.map((fecha) => (
                      <Button
                        key={fecha.id}
                        variant={selectedFecha === fecha.id ? "contained" : "outlined"}
                        onClick={() => setSelectedFecha(fecha.id)}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          bgcolor: selectedFecha === fecha.id ? "white" : "transparent",
                          color: selectedFecha === fecha.id ? "primary.main" : "white",
                          borderColor: "white",
                          "&:hover": {
                            bgcolor: selectedFecha === fecha.id ? "white" : "rgba(255,255,255,0.1)",
                            borderColor: "white",
                          }
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarToday fontSize="small" />
                            <Typography variant="body2">
                              {new Date(fecha.fecha_inicio).toLocaleDateString()} - {new Date(fecha.fecha_fin).toLocaleDateString()}
                            </Typography>
                          </Stack>
                          {fecha.cupos_disponibles !== undefined && (
                            <Typography variant="caption" sx={{ opacity: 0.8, display: "block", ml: 3.5 }}>
                              {fecha.cupos_disponibles} cupos disponibles
                            </Typography>
                          )}
                        </Box>
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Selector de cantidad */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Cantidad de personas
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": { bgcolor: "grey.200" }
                    }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography variant="h5" sx={{ fontWeight: 700, minWidth: 40, textAlign: "center" }}>
                    {cantidad}
                  </Typography>
                  <IconButton
                    onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      "&:hover": { bgcolor: "grey.200" }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Stack>
              </Box>

              {/* Total */}
              <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    ${(precioFinal * cantidad).toLocaleString()}
                  </Typography>
                </Stack>
              </Box>

              {/* Botón agregar al carrito */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!selectedFecha || addingToCart}
                sx={{
                  bgcolor: "#9CCC65", // Verde Lima
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#8BC34A",
                  },
                  "&:disabled": {
                    bgcolor: "grey.400",
                  }
                }}
              >
                {addingToCart ? "AGREGANDO..." : "AÑADIR AL CARRITO"}
              </Button>

              {!user && (
                <Alert severity="info" sx={{ mt: 2, bgcolor: "white" }}>
                  Inicia sesión para poder reservar
                </Alert>
              )}

              {/* Info adicional */}
              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle fontSize="small" />
                    <Typography variant="body2">Cancelación gratuita hasta 7 días antes</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle fontSize="small" />
                    <Typography variant="body2">Confirmación inmediata</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle fontSize="small" />
                    <Typography variant="body2">Pago seguro</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* SECCIÓN DE TABS (Ancho Completo) */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={2}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Información General" />
              <Tab label="Incluye" />
              <Tab label="No Incluye" />
              <Tab label="Itinerario" />
              <Tab label="Recomendaciones" />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {/* Tab 0: Información General */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    Sobre este viaje
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {trip.descripcion_completa || trip.descripcion_corta}
                  </Typography>
                </Box>
              )}

              {/* Tab 1: Incluye */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    ¿Qué incluye?
                  </Typography>
                  {trip.incluye ? (
                    <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
                      {trip.incluye}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay información disponible
                    </Typography>
                  )}
                </Box>
              )}

              {/* Tab 2: No Incluye */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    ¿Qué NO incluye?
                  </Typography>
                  {trip.no_incluye ? (
                    <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
                      {trip.no_incluye}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay información disponible
                    </Typography>
                  )}
                </Box>
              )}

              {/* Tab 3: Itinerario */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    Itinerario del viaje
                  </Typography>
                  {trip.itinerario ? (
                    <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
                      {trip.itinerario}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Itinerario próximamente
                    </Typography>
                  )}
                </Box>
              )}

              {/* Tab 4: Recomendaciones */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    Recomendaciones
                  </Typography>
                  {trip.recomendaciones ? (
                    <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
                      {trip.recomendaciones}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay recomendaciones disponibles
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        {/* SECCIÓN DE RESEÑAS (Placeholder) */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Reseñas de viajeros
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating value={4.5} precision={0.5} readOnly size="large" />
              <Typography variant="h6">4.5 de 5</Typography>
              <Typography variant="body2" color="text.secondary">(23 reseñas)</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Sistema de reseñas próximamente...
            </Typography>
          </Paper>
        </Box>

        {/* VIAJES SIMILARES (Placeholder) */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Viajes similares
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Carrusel de viajes similares próximamente...
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
