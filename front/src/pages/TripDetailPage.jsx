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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
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
} from "@mui/icons-material"
import Header from "../components/Header"
import { TripGallery } from "../components/TripGallery"
import { TripInfoTabs } from "../components/TripInfoTabs"
import { useTrip } from "../hooks/useTrip"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

/**
 * TripDetailPage - Página de detalle de un viaje
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
        // Mostrar mensaje de éxito (TODO: implementar con Snackbar)
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
      // Fallback: copiar URL al portapapeles
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
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/" onClick={() => navigate("/")}>
            Inicio
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/catalogo"
            onClick={() => navigate("/catalogo")}
          >
            Catálogo
          </Link>
          <Typography color="text.primary">{trip.titulo}</Typography>
        </Breadcrumbs>

        {/* Título y acciones */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {trip.titulo}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Place fontSize="small" color="action" />
              <Typography variant="body1" color="text.secondary">
                {trip.destino}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? "Guardado" : "Guardar"}
            </Button>
            <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
              Compartir
            </Button>
          </Stack>
        </Box>

        {/* Galería */}
        <Box sx={{ mb: 4 }}>
          <TripGallery images={trip.imagenes || [trip.imagen_principal]} />
        </Box>

        {/* Contenido principal */}
        <Grid container spacing={4}>
          {/* Columna izquierda: Info */}
          <Grid item xs={12} md={8}>
            {/* Tags y metadata */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
              <Chip icon={<AccessTime />} label={`${trip.duracion_dias} días`} />
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
              />
              {trip.categoria && <Chip label={trip.categoria} variant="outlined" />}
            </Stack>

            {/* Tabs con info detallada */}
            <TripInfoTabs trip={trip} />

            {/* TODO: Mapa de la ruta */}
            <Paper sx={{ p: 3, mt: 4 }} elevation={1}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Ubicación
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mapa del recorrido (TODO: integrar Google Maps / Leaflet)
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Columna derecha: Reserva */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                position: "sticky",
                top: 80,
              }}
              elevation={3}
            >
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                ${precioFinal?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Por persona
              </Typography>

              {/* Selector de fecha */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Fecha de salida</InputLabel>
                <Select
                  value={selectedFecha}
                  label="Fecha de salida"
                  onChange={(e) => setSelectedFecha(e.target.value)}
                >
                  {trip.fechas_disponibles?.map((fecha) => (
                    <MenuItem key={fecha.id} value={fecha.id}>
                      {new Date(fecha.fecha_inicio).toLocaleDateString()} -{" "}
                      {new Date(fecha.fecha_fin).toLocaleDateString()}
                      {fecha.cupos_disponibles !== undefined && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({fecha.cupos_disponibles} cupos)
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selector de cantidad */}
              <TextField
                fullWidth
                type="number"
                label="Cantidad de personas"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 10 }}
                sx={{ mb: 3 }}
              />

              {/* Total */}
              <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ${(precioFinal * cantidad).toLocaleString()}
                </Typography>
              </Box>

              {/* Botones */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!selectedFecha || addingToCart}
                >
                  {addingToCart ? "Agregando..." : "Agregar al Carrito"}
                </Button>

                {!user && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Inicia sesión para poder reservar
                  </Alert>
                )}
              </Stack>

              {/* Info adicional */}
              <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ✓ Cancelación gratuita hasta 7 días antes
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ✓ Confirmación inmediata
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ✓ Pago seguro
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
