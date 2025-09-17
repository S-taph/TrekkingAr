import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Container,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [filters, setFilters] = useState({
    fecha: '',
    dificultad: '',
    dias: '',
    lugar: ''
  });

  const dificultadOptions = [
    { value: 'facil', label: 'Fácil' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'dificil', label: 'Difícil' },
    { value: 'extremo', label: 'Extremo' }
  ];

  const handleChange = (field) => (event) => {
    setFilters({
      ...filters,
      [field]: event.target.value
    });
  };

  const handleSearch = () => {
    console.log('Buscando con filtros:', filters);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        py: 6,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/public/banner1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mb: 4
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
          }}
        >
          ¡Encontrá tu próxima aventura!
        </Typography>

        <Grid container spacing={2} alignItems="flex-end">
          {/* Fecha */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
              }}
            >
              Fecha*
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={filters.fecha}
              onChange={handleChange('fecha')}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                }
              }}
            />
          </Grid>

          {/* Dificultad */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
              }}
            >
              Dificultad
            </Typography>
            <TextField
              select
              fullWidth
              value={filters.dificultad}
              onChange={handleChange('dificultad')}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                }
              }}
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {dificultadOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Cantidad de Días */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
              }}
            >
              Cantidad de Días
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={filters.dias}
              onChange={handleChange('dias')}
              size="small"
              placeholder="Días"
              inputProps={{ min: 1 }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                }
              }}
            />
          </Grid>

          {/* Lugar */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
              }}
            >
              Lugar
            </Typography>
            <TextField
              fullWidth
              value={filters.lugar}
              onChange={handleChange('lugar')}
              size="small"
              placeholder="Palabras claves..."
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                }
              }}
            />
          </Grid>

          {/* Botón Buscar */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ 
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.dark'
                }
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchBar;