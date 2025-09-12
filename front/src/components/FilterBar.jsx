import { useState } from 'react';
import {
  Box,
  Chip,
  Slider,
  Typography,
  InputAdornment,
  TextField,
} from '@mui/material';

const categories = ['Montaña', 'Cultural', 'Selva', 'Desierto'];

const FilterBar = () => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h6">Filtrar por categoría</Typography>
      <Box sx={{ mt: 1, mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <Chip key={cat} label={cat} clickable color="primary" />
        ))}
      </Box>

      <Typography variant="h6">Filtrar por precio</Typography>
      <Slider
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        max={1000000}
        sx={{ width: '100%' }}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Mínimo"
          size="small"
          value={priceRange[0]}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Máximo"
          size="small"
          value={priceRange[1]}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default FilterBar;
