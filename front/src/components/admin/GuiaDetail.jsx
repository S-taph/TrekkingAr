"use client"

import { Box, Typography, Grid, Card, CardContent, Chip, Avatar } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

const GuiaDetail = ({ guia }) => {
  if (!guia) return null

  const getInitials = (nombre, apellido) =>
    `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Avatar sx={{ width: 90, height: 90, bgcolor: "primary.main", mb: 2, fontSize: 24 }}>
          {getInitials(guia.usuario?.nombre, guia.usuario?.apellido)}
        </Avatar>
        <Typography variant="h4" fontWeight="bold">
          {guia.usuario?.nombre} {guia.usuario?.apellido}
        </Typography>
        <Box display="flex" gap={1} mt={1}>
          <Chip
            icon={guia.activo ? <CheckCircleIcon /> : <CancelIcon />}
            label={guia.activo ? "Activo" : "Inactivo"}
            color={guia.activo ? "success" : "default"}
            size="small"
          />
          <Chip
            icon={guia.disponible ? <CheckCircleIcon /> : <CancelIcon />}
            label={guia.disponible ? "Disponible" : "No disponible"}
            color={guia.disponible ? "success" : "error"}
            size="small"
          />
        </Box>
      </Box>

      {/* Secciones con animación */}
      <Section title="Información General" color="#e3f2fd">
        <DetailCard label="ID del Guía" value={guia.id_guia} />
        <DetailCard label="Años de Experiencia" value={guia.anos_experiencia || "No especificado"} />
        <DetailCard label="Idiomas" value={guia.idiomas || "No especificado"} />
        <DetailCard label="Tarifa por Día" value={guia.tarifa_por_dia ? `$${guia.tarifa_por_dia}` : "No especificado"} />
      </Section>

      <Section title="Actividad" color="#fff3e0">
        <DetailCard label="Calificación Promedio" value={guia.calificacion_promedio ? `${guia.calificacion_promedio}/5` : "Sin calificar"} />
        <DetailCard label="Total Viajes Guiados" value={guia.total_viajes_guiados || 0} />
      </Section>

      <Section title="Registro y Actualización" color="#e8f5e9">
        <DetailCard label="Fecha de Registro" value={guia.fecha_registro ? new Date(guia.fecha_registro).toLocaleDateString() : "No disponible"} />
        <DetailCard label="Última Actualización" value={guia.fecha_actualizacion ? new Date(guia.fecha_actualizacion).toLocaleDateString() : "No disponible"} />
      </Section>

      <Section title="Información Adicional" color="#fffde7">
        <DetailBlock label="Certificaciones" value={guia.certificaciones || "No especificado"} />
        <DetailBlock label="Especialidades" value={guia.especialidades || "No especificado"} />
      </Section>
    </motion.div>
  )
}

const Section = ({ title, children, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Box mb={4}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ backgroundColor: color || "#fafafa", p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>{children}</Grid>
      </Box>
    </Box>
  </motion.div>
)

const DetailCard = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 150 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body1" fontWeight={500}>{value}</Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>
)

const DetailBlock = ({ label, value }) => (
  <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 120 }}>
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary" gutterBottom>{label}</Typography>
        <Typography variant="body1">{value}</Typography>
      </CardContent>
    </Card>
  </motion.div>
)

export default GuiaDetail
