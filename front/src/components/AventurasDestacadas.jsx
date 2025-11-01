import { Grid, Typography, Container, Box, CircularProgress, Alert } from "@mui/material";
import { TripCard } from "./TripCard";
import { useViajes } from "../hooks/useViajes";

const AventurasDestacadas = () => {
  // Obtener solo los viajes marcados como destacados (máximo 6)
  const { viajes, loading, error } = useViajes({ limit: 6, activo: true, destacado: true });

  // Si no hay viajes destacados, no mostrar la sección
  if (!loading && !error && viajes.length === 0) {
    return null;
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        align="center"
      >
        Aventuras Destacadas
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Descubre nuestras experiencias más populares y recomendadas
      </Typography>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Grid de viajes destacados */}
      {!loading && !error && (
        <Grid
          container
          spacing={3}
          justifyContent="center"
        >
          {viajes.map((viaje) => (
            <Grid item key={viaje.id_viaje} xs={12} sm={6} md={4}>
              <TripCard trip={viaje} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AventurasDestacadas;
