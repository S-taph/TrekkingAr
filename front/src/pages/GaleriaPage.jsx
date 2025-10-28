import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material"
import {
  Close as CloseIcon,
  NavigateBefore,
  NavigateNext,
  ZoomIn,
} from "@mui/icons-material"
import Header from "../components/Header"
import { viajesAPI } from "../services/api"

/**
 * GaleriaPage - Galería de imágenes de todos los viajes
 * Muestra todas las fotos en un diseño masonry con lightbox
 */
export default function GaleriaPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    document.title = "Galería - TrekkingAR"
    fetchAllImages()
  }, [])

  const fetchAllImages = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener todos los viajes con sus imágenes
      const response = await viajesAPI.getViajes({ limit: 100, activo: true })

      if (response.success) {
        // Extraer todas las imágenes de todos los viajes
        const allImages = []

        response.data.viajes.forEach((viaje) => {
          // Agregar imagen principal si existe
          if (viaje.imagen_principal_url) {
            allImages.push({
              url: viaje.imagen_principal_url,
              titulo: viaje.titulo,
              destino: viaje.destino,
              id_viaje: viaje.id_viaje,
            })
          }

          // Agregar imágenes adicionales si existen
          if (viaje.imagenes && Array.isArray(viaje.imagenes)) {
            viaje.imagenes.forEach((imagen) => {
              allImages.push({
                url: typeof imagen === 'string' ? imagen : imagen.url,
                titulo: viaje.titulo,
                destino: viaje.destino,
                id_viaje: viaje.id_viaje,
              })
            })
          }
        })

        setImages(allImages)
      } else {
        throw new Error(response.message || "Error cargando imágenes")
      }
    } catch (err) {
      console.error("[GaleriaPage] Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const handlePrevious = (e) => {
    e.stopPropagation()
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const handleNext = (e) => {
    e.stopPropagation()
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  // Determinar número de columnas según tamaño de pantalla
  const cols = isMobile ? 1 : isTablet ? 2 : 4

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Galería de Aventuras
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explora los paisajes más increíbles de nuestros trekkings
          </Typography>
          {images.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {images.length} {images.length === 1 ? "imagen" : "imágenes"}
            </Typography>
          )}
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Galería Masonry */}
        {!loading && !error && images.length > 0 && (
          <ImageList
            variant="masonry"
            cols={cols}
            gap={16}
            sx={{
              mb: 0,
              "& .MuiImageListItem-root": {
                overflow: "hidden",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: theme.shadows[10],
                  "& .overlay": {
                    opacity: 1,
                  },
                },
              },
            }}
          >
            {images.map((image, index) => (
              <ImageListItem
                key={index}
                onClick={() => handleImageClick(image, index)}
              >
                <img
                  src={image.url}
                  alt={image.titulo}
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                  }}
                />
                {/* Overlay con información */}
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                    color: "white",
                    p: 2,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {image.titulo}
                  </Typography>
                  <Typography variant="caption">{image.destino}</Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        )}

        {/* Sin imágenes */}
        {!loading && !error && images.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No hay imágenes disponibles
            </Typography>
          </Box>
        )}
      </Container>

      {/* Modal Lightbox */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.95)",
        }}
      >
        <Fade in={Boolean(selectedImage)}>
          <Box
            sx={{
              position: "relative",
              maxWidth: "95vw",
              maxHeight: "95vh",
              outline: "none",
            }}
            onClick={handleClose}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "white" },
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Botón anterior */}
            {images.length > 1 && (
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  zIndex: 2,
                }}
              >
                <NavigateBefore />
              </IconButton>
            )}

            {/* Botón siguiente */}
            {images.length > 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  zIndex: 2,
                }}
              >
                <NavigateNext />
              </IconButton>
            )}

            {/* Imagen ampliada */}
            {selectedImage && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.titulo}
                  style={{
                    maxWidth: "95vw",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
                {/* Información de la imagen */}
                <Box
                  sx={{
                    mt: 2,
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    maxWidth: "600px",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedImage.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedImage.destino}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    Imagen {currentIndex + 1} de {images.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
