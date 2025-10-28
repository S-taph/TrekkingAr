import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  AccessTime as DurationIcon,
  TrendingUp as DifficultyIcon,
  Place as LocationIcon,
  CalendarToday as DateIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { getViajeMainImage, handleImageError } from "../utils/imageUrl"

/**
 * TripCard - Tarjeta de viaje para catálogo
 * @param {Object} trip - Objeto del viaje con sus propiedades
 * @param {boolean} loading - Estado de carga
 */
export const TripCard = ({ trip, loading = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [adding, setAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLoginRequired, setShowLoginRequired] = useState(false)

  if (loading) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ flex: 1 }}>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
        </CardContent>
      </Card>
    )
  }

  const {
    id_viaje,
    titulo,
    descripcion_corta,
    imagen_principal,
    destino,
    duracion_dias,
    dificultad,
    precio_base,
    fechas_disponibles = [],
  } = trip

  // Obtener próxima fecha disponible
  const proximaFecha = fechas_disponibles[0]
  const precioFinal = proximaFecha?.precio_fecha || precio_base

  // Mapa de colores para dificultad
  const dificultadColors = {
    facil: "success",
    moderada: "warning",
    dificil: "error",
    extrema: "error",
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!proximaFecha) return

    // Verificar si el usuario está autenticado
    if (!user) {
      setShowLoginRequired(true)
      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate("/login", { state: { from: location.pathname } })
      }, 2000)
      return
    }

    setAdding(true)
    try {
      const result = await addItem({
        id_viaje,
        id_fecha_viaje: proximaFecha.id_fechas_viaje,
        cantidad: 1,
      })

      if (result.success) {
        setShowSuccess(true) // Mostrar notificación de éxito
      }
    } catch (error) {
      console.error("Error agregando al carrito:", error)
    } finally {
      setAdding(false)
    }
  }

  const handleCardClick = () => {
    navigate(`/viajes/${id_viaje}`)
  }

  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // TODO: Integrar con backend para persistir favoritos
  }

  return (
    <Card
      sx={{
        height: "580px", // Altura aumentada para evitar cortes
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Imagen principal */}
      <Box
        sx={{ position: "relative", cursor: "pointer" }}
        onClick={handleCardClick}
      >
        <CardMedia
          component="img"
          height="200"
          image={getViajeMainImage(trip)}
          alt={titulo}
          sx={{ objectFit: "cover" }}
          onError={(e) => {
            handleImageError(e)
            e.stopPropagation() // Prevenir propagación del evento
          }}
        />
        {/* Botón favorito */}
        <IconButton
          onClick={handleFavoriteToggle}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.9)",
            "&:hover": {
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? "rgba(0,0,0,0.85)"
                : "rgba(255,255,255,1)"
            },
          }}
          size="small"
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon sx={{
              color: (theme) => theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : "inherit"
            }} />
          )}
        </IconButton>

        {/* Chip de dificultad */}
        <Chip
          label={dificultad}
          color={dificultadColors[dificultad?.toLowerCase()] || "default"}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Contenido */}
      <CardContent
        sx={{
          flex: 1,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={handleCardClick}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 700,
            minHeight: "64px", // Altura mínima para título
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {titulo}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: "40px", // Altura mínima para descripción
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {descripcion_corta || descripcion}
        </Typography>

        {/* Metadata */}
        <Stack spacing={1} sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {destino}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <DurationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {duracion_dias} {duracion_dias === 1 ? "día" : "días"}
            </Typography>
          </Box>

          {proximaFecha && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DateIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Próxima salida:{" "}
                {new Date(proximaFecha.fecha_inicio).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      {/* Precio y acciones */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          mt: "auto", // Empuja las acciones al fondo
        }}
      >
        {/* Precio arriba */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Desde
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
            ${precioFinal?.toLocaleString()}
          </Typography>
        </Box>

        {/* Botones abajo con flexbox */}
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
            sx={{ flex: 1 }}
          >
            Ver más
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            disabled={!proximaFecha || adding}
            startIcon={<CartIcon />}
            sx={{
              flex: 1,
              bgcolor: "success.main",
              "&:hover": {
                bgcolor: "success.dark",
              },
              "&.Mui-disabled": {
                bgcolor: "grey.400",
                color: "white",
              }
            }}
          >
            {adding ? "..." : "Reservar"}
          </Button>
        </Stack>
      </Box>

      {/* Snackbar de confirmación */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Viaje agregado al carrito
        </Alert>
      </Snackbar>

      {/* Snackbar de login requerido */}
      <Snackbar
        open={showLoginRequired}
        autoHideDuration={2000}
        onClose={() => setShowLoginRequired(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowLoginRequired(false)} severity="info" sx={{ width: "100%" }}>
          Debes iniciar sesión para reservar. Redirigiendo...
        </Alert>
      </Snackbar>
    </Card>
  )
}
