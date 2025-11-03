import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, CircularProgress, Alert } from '@mui/material';
import ReviewCard from './ReviewCard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api';

/**
 * ReviewsList - Lista de reviews/comentarios
 * @param {number} limit - Cantidad máxima de reviews a mostrar
 * @param {number} viajeId - ID del viaje (opcional, para filtrar)
 */
const ReviewsList = ({ limit = 6, viajeId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          limit,
          activo: true,
          ...(viajeId && { viajeId })
        };

        const response = await axios.get(`${API_URL}/reviews`, { params });

        if (response.data.success) {
          setReviews(response.data.data.reviews || []);
        } else {
          throw new Error('Error al cargar reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('No se pudieron cargar los comentarios');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit, viajeId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        No hay comentarios disponibles
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#FFE8DC',
        py: { xs: 6, md: 8 },
        borderRadius: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 6,
            color: 'text.primary'
          }}
        >
          Comentarios & Reviews
        </Typography>

        <Grid container spacing={3}>
          {reviews.map((review, index) => (
            <Grid item xs={12} sm={6} md={4} key={review.id_review}>
              <ReviewCard review={review} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ReviewsList;
