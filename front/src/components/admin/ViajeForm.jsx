"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import ImageIcon from "@mui/icons-material/Image"
import CloseIcon from "@mui/icons-material/Close"
import { viajesAPI, categoriasAPI } from "../../services/api"

export default function ViajeForm({ viaje, mode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id_categoria: "",
    titulo: "",
    descripcion_corta: "",
    descripcion_completa: "",
    dificultad: "",
    duracion_dias: "",
    precio_base: "",
    minimo_participantes: "",
    maximo_participantes: "",
    incluye: "",
    no_incluye: "",
    recomendaciones: "",
    activo: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Datos para selects
  const [categorias, setCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)

  // Image management state
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoadingCategorias(true)
        const data = await categoriasAPI.getCategorias()
        if (data.success && data.data.categorias.length > 0) {
          setCategorias(data.data.categorias)
        } else {
          await createDefaultCategories()
        }
      } catch (error) {
        console.error("Error loading categories:", error)
        await createDefaultCategories()
      } finally {
        setLoadingCategorias(false)
      }
    }

    const createDefaultCategories = async () => {
      const defaultCategories = [
        { nombre: "Trekking", descripcion: "Caminatas y senderismo", activa: true, orden_visualizacion: 1 },
        { nombre: "Montañismo", descripcion: "Escalada y montañismo", activa: true, orden_visualizacion: 2 },
        { nombre: "Aventura", descripcion: "Actividades de aventura", activa: true, orden_visualizacion: 3 },
        { nombre: "Expedición", descripcion: "Expediciones largas", activa: true, orden_visualizacion: 4 },
      ]

      const createdCategories = []

      // ✅ Usar variable de entorno para la API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api"

      for (const category of defaultCategories) {
        try {
          const response = await fetch(`${API_BASE_URL}/categorias`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-bypass-auth": "true",
            },
            body: JSON.stringify(category),
          })

          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              createdCategories.push(result.data.categoria)
            }
          }
        } catch (error) {
          console.error("Error creating category:", category.nombre, error)
        }
      }

      if (createdCategories.length > 0) {
        setCategorias(createdCategories)
      } else {
        setCategorias([
          { id_categoria: 1, nombre: "Trekking" },
          { id_categoria: 2, nombre: "Montañismo" },
          { id_categoria: 3, nombre: "Aventura" },
          { id_categoria: 4, nombre: "Expedición" },
        ])
      }
    }

    loadCategorias()
  }, [])

  useEffect(() => {
    if (mode === "edit" && viaje) {
      setFormData({
        id_categoria: viaje.id_categoria || "",
        titulo: viaje.titulo || "",
        descripcion_corta: viaje.descripcion_corta || "",
        descripcion_completa: viaje.descripcion_completa || "",
        dificultad: viaje.dificultad || "",
        duracion_dias: viaje.duracion_dias || "",
        precio_base: viaje.precio_base || "",
        minimo_participantes: viaje.minimo_participantes || "",
        maximo_participantes: viaje.maximo_participantes || "",
        incluye: viaje.incluye || "",
        no_incluye: viaje.no_incluye || "",
        recomendaciones: viaje.recomendaciones || "",
        activo: viaje.activo !== undefined ? viaje.activo : true,
      })

      // Load existing images if in edit mode
      if (viaje.imagenes && Array.isArray(viaje.imagenes)) {
        setExistingImages(viaje.imagenes)
      }
    }
  }, [viaje, mode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Image handling functions
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setSelectedImages((prev) => [...prev, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  const removeNewImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index].url)

    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }
  // Usar el servicio de API centralizado para eliminar la imagen
  const removeExistingImage = async (imageId) => {
    try {
      // 1. Llamar al nuevo método de API DELETE
      await viajesAPI.deleteImage(viaje.id_viaje, imageId)

      // 2. Si la llamada fue exitosa, actualizar el estado
      setExistingImages((prev) => prev.filter((img) => img.id_imagen_viaje !== imageId))
      setError("")
    } catch (error) {
      console.error("Error deleting image:", error)
      setError(error.message || "Error al eliminar la imagen")
    }
  }

  const uploadImages = async (viajeId, files) => {
    if (!files || files.length === 0) return []

    try {
      const result = await viajesAPI.uploadImages(viajeId, files)
      return result.data?.urls || []
    } catch (err) {
      console.error("Error uploading images:", err)
      throw err
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepara datos para el backend
      const submitData = {
        id_categoria: formData.id_categoria || null,
        titulo: formData.titulo?.trim() || "",
        descripcion_corta: formData.descripcion_corta || "",
        descripcion_completa: formData.descripcion_completa || "",
        dificultad: formData.dificultad || "",
        duracion_dias: formData.duracion_dias ? parseInt(formData.duracion_dias, 10) : 0,
        precio_base: formData.precio_base ? parseFloat(formData.precio_base) : 0,
        minimo_participantes: formData.minimo_participantes ? parseInt(formData.minimo_participantes, 10) : 1,
        maximo_participantes: formData.maximo_participantes ? parseInt(formData.maximo_participantes, 10) : null,
        incluye: formData.incluye || "",
        no_incluye: formData.no_incluye || "",
        recomendaciones: formData.recomendaciones || "",
        activo: formData.activo === true || formData.activo === "true",
        equipamiento: formData.equipamiento || [],
        servicios: formData.servicios || [],
      };

      // Validación de campos obligatorios
      const requiredFields = ["id_categoria", "titulo", "dificultad", "duracion_dias", "precio_base"];
      for (const field of requiredFields) {
        const value = submitData[field];
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" && isNaN(value)) ||
          (["duracion_dias","precio_base"].includes(field) && Number(value) <= 0)
        ) {
          throw new Error(`El campo "${field}" es obligatorio y debe tener un valor válido.`);
        }
      }

      // Llamada a API según modo
      let viajeId;
      if (mode === "create") {
        const result = await viajesAPI.createViaje(submitData);
        viajeId = result.data?.viaje?.id_viaje;
      } else {
        await viajesAPI.updateViaje(viaje.id_viaje, submitData);
        viajeId = viaje.id_viaje;
      }

      // Subir imágenes si hay seleccionadas
      if (viajeId && selectedImages.length > 0) {
        const uploadedUrls = await uploadImages(viajeId, selectedImages);

        // 🔹 Actualizar estado de imágenes existentes para edit mode
        if (mode === "edit") {
          setExistingImages(prev => [
            ...prev,
            ...uploadedUrls.map((url, index) => ({
              id_imagen: Date.now() + index, // temporal, reemplazar por id real si el backend lo devuelve
              url_imagen: url,
            }))
          ]);
          setSelectedImages([]);
          setImagePreviews([]);
        }
      }

      onSuccess();
    } catch (error) {
      console.error("[v0] Error in handleSubmit:", error);
      setError(error.message || "Error al guardar el viaje");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid2 container spacing={3}>
        {/* Información básica */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <FormControl fullWidth required size="medium">
            <InputLabel sx={{ fontSize: "1rem" }}>Categoría</InputLabel>
            <Select
              name="id_categoria"
              value={formData.id_categoria}
              label="Categoría"
              onChange={handleChange}
              disabled={loadingCategorias}
              sx={{
                minHeight: "56px",
                fontSize: "1rem",
              }}
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <FormControl fullWidth required size="medium">
            <InputLabel sx={{ fontSize: "1rem" }}>Dificultad</InputLabel>
            <Select
              name="dificultad"
              value={formData.dificultad}
              label="Dificultad"
              onChange={handleChange}
              sx={{
                minHeight: "56px",
                fontSize: "1rem",
              }}
            >
              <MenuItem value="facil">Fácil</MenuItem>
              <MenuItem value="moderado">Moderado</MenuItem>
              <MenuItem value="dificil">Difícil</MenuItem>
              <MenuItem value="extremo">Extremo</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            required
            size="medium"
            name="titulo"
            label="Título del Viaje"
            value={formData.titulo}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="medium"
            name="descripcion_corta"
            label="Descripción Corta"
            value={formData.descripcion_corta}
            onChange={handleChange}
            helperText="Descripción breve que aparecerá en las tarjetas de viajes"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={5}
            size="medium"
            name="descripcion_completa"
            label="Descripción Completa"
            value={formData.descripcion_completa}
            onChange={handleChange}
            helperText="Descripción detallada del viaje"
          />
        </Grid2>

        {/* Detalles del viaje */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Detalles del Viaje
          </Typography>
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <TextField
            fullWidth
            required
            size="medium"
            type="number"
            name="duracion_dias"
            label="Duración"
            value={formData.duracion_dias}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">días</InputAdornment>,
            }}
          />
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <TextField
            fullWidth
            required
            size="medium"
            type="number"
            name="precio_base"
            label="Precio Base"
            value={formData.precio_base}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid2>

        <Grid2 item xs={12} md={4}>
          <FormControl fullWidth size="medium">
            <InputLabel sx={{ fontSize: "1rem" }}>Estado</InputLabel>
            <Select
              name="activo"
              value={formData.activo}
              label="Estado"
              onChange={handleChange}
              sx={{
                minHeight: "56px",
                fontSize: "1rem",
              }}
            >
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            size="medium"
            type="number"
            name="minimo_participantes"
            label="Mínimo Participantes"
            value={formData.minimo_participantes}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextField
            fullWidth
            size="medium"
            type="number"
            name="maximo_participantes"
            label="Máximo Participantes"
            value={formData.maximo_participantes}
            onChange={handleChange}
          />
        </Grid2>

        {/* Información adicional */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Información Adicional
          </Typography>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="medium"
            name="incluye"
            label="Qué Incluye"
            value={formData.incluye}
            onChange={handleChange}
            helperText="Servicios y elementos incluidos en el precio"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="medium"
            name="no_incluye"
            label="Qué NO Incluye"
            value={formData.no_incluye}
            onChange={handleChange}
            helperText="Servicios y elementos NO incluidos en el precio"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="medium"
            name="recomendaciones"
            label="Recomendaciones"
            value={formData.recomendaciones}
            onChange={handleChange}
            helperText="Recomendaciones para los participantes"
          />
        </Grid2>

        {/* Image Upload Section */}
        <Grid2 item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Imágenes del Viaje
          </Typography>
        </Grid2>

        <Grid2 item xs={12}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{
              minHeight: "56px",
              fontSize: "1rem",
              textTransform: "none",
              borderStyle: "dashed",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                borderStyle: "dashed",
              },
            }}
          >
            Seleccionar Imágenes (Múltiples)
            <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Formatos aceptados: JPG, PNG, WebP. Puede seleccionar múltiples imágenes.
          </Typography>
        </Grid2>

        {/* Existing Images (Edit Mode) */}
        {mode === "edit" && existingImages.length > 0 && (
          <Grid2 item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Imágenes Actuales ({existingImages.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
              {existingImages.map((image) => (
                <Card key={image.id_imagen_viaje} sx={{ width: 150, position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.url}
                    alt={image.descripcion || "Imagen del viaje"}
                    sx={{
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      }
                    }}
                    onClick={() => {
                      setLightboxImage(image)
                      setLightboxOpen(true)
                    }}
                  />
                  {image.es_principal && (
                    <Chip
                      label="Principal"
                      color="primary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <CardActions sx={{ justifyContent: "center", p: 0.5 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeExistingImage(image.id_imagen_viaje)}
                      aria-label="Eliminar imagen"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Grid2>
        )}

        {/* New Images Preview */}
        {imagePreviews.length > 0 && (
          <Grid2 item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Nuevas Imágenes a Subir ({imagePreviews.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
              {imagePreviews.map((preview, index) => (
                <Card key={index} sx={{ width: 150, position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={preview.url}
                    alt={preview.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <Chip
                    icon={<ImageIcon />}
                    label={`${(preview.size / 1024).toFixed(0)} KB`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                    }}
                  />
                  <CardActions sx={{ justifyContent: "center", p: 0.5 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeNewImage(index)}
                      aria-label="Quitar imagen"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Grid2>
        )}

      </Grid2>

      {/* Botones */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : mode === "create" ? "Crear Viaje" : "Actualizar Viaje"}
        </Button>
      </Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {lightboxImage?.descripcion || "Vista previa de imagen"}
            </Typography>
            <IconButton onClick={() => setLightboxOpen(false)} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
          {lightboxImage && (
            <Box
              component="img"
              src={lightboxImage.url}
              alt={lightboxImage.descripcion || "Imagen del viaje"}
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
