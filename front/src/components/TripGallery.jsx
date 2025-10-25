import { useState } from "react"
import { Box, ImageList, ImageListItem, Modal, IconButton } from "@mui/material"
import { Close as CloseIcon, NavigateBefore, NavigateNext } from "@mui/icons-material"

/**
 * TripGallery - Galería de imágenes del viaje
 * @param {Array} images - Array de URLs de imágenes
 */
export const TripGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 400,
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
      >
        <img src="/placeholder-trip.jpg" alt="No disponible" style={{ maxHeight: "100%" }} />
      </Box>
    )
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

  return (
    <>
      <ImageList
        sx={{ width: "100%", height: 450, borderRadius: 2, overflow: "hidden" }}
        variant="quilted"
        cols={4}
        rowHeight={121}
      >
        {images.map((image, index) => (
          <ImageListItem
            key={index}
            cols={index === 0 ? 2 : 1}
            rows={index === 0 ? 2 : 1}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                zIndex: 1,
              },
            }}
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={image}
              alt={`Imagen ${index + 1}`}
              loading="lazy"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              onError={(e) => {
                e.target.src = "/placeholder-trip.jpg"
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Modal para vista ampliada */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.9)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
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
          <img
            src={selectedImage}
            alt="Vista ampliada"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </Box>
      </Modal>
    </>
  )
}
