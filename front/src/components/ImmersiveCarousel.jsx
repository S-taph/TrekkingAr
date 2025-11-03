import React from 'react';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

/**
 * ImmersiveCarousel - Carrusel inmersivo con efecto Ken Burns
 * @param {Object} props
 * @param {Array} props.images - Array de URLs de imágenes
 * @param {Number} props.height - Altura del carrusel (default: 500)
 */
const ImmersiveCarousel = ({ images = [], height = 500 }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6 }}>
      {/* Título */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 3,
          textAlign: 'center',
        }}
      >
        Viví la experiencia
      </Typography>

      {/* Carrusel */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 4,
          '& .swiper': {
            height: { xs: 280, sm: 380, md: height },
          },
          '& .swiper-button-prev, & .swiper-button-next': {
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            '&:after': {
              fontSize: '20px',
              fontWeight: 'bold',
            },
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
            transition: 'all 0.2s ease',
          },
        }}
      >
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          loop={images.length > 1}
          speed={2000}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Imagen con efecto Ken Burns */}
                <Box
                  component="img"
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'kenBurns 12s ease-out infinite alternate',
                    '@keyframes kenBurns': {
                      '0%': {
                        transform: 'scale(1) translateX(0)',
                      },
                      '100%': {
                        transform: 'scale(1.06) translateX(-2%)',
                      },
                    },
                  }}
                />

                {/* Overlay sutil para mejor legibilidad */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
                    pointerEvents: 'none',
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Texto motivacional */}
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          mt: 2,
          color: 'text.secondary',
          fontStyle: 'italic',
        }}
      >
        Tu próxima aventura te espera
      </Typography>
    </Box>
  );
};

export default ImmersiveCarousel;
