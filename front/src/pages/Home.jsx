import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../components/Header.jsx';
import Banner from '../components/Banner.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProductList from '../components/ProductList.jsx';
import Hero from '../components/Hero.jsx';
import Footer from '../components/Footer.jsx';
import Drawer from '@mui/material/Drawer';

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilterDrawer = (open) => () => {
    setFilterOpen(open);
  };

  return (
    <>
      <Header />
      <Banner />

      <Container sx={{ mt: 4 }}>
        {/* Botón para abrir filtro en celus */}
        <Box sx={{ mb: 2, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={toggleFilterDrawer(true)}>
            Filtrar
          </Button>
        </Box>

        {/* Contenedor flex para ProductList y FilterBar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          {/* ProductList ocupa todo el ancho en xs, y flex 1 en md+ */}
          <Box sx={{ flex: 1 }}>
            <ProductList />
          </Box>

          {/* FilterBar visible solo md+ y de ancho fijo */}
          <Box
            sx={{
              width: 280,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <FilterBar />
          </Box>
        </Box>

        {/* Styling del Hero */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: { xs: '100%', md: '900px' },
            mx: 'auto',
            width: '100%',
          }}
        >
          <Hero />
        </Box>
      </Container>

      <Footer />

      {/* Drawer para barra de filtros en celus */}
      <Drawer anchor="right" open={filterOpen} onClose={toggleFilterDrawer(false)} ModalProps={{keepMounted: true,}}>
        <Box sx={{ width: 280, p: 2 }}>
          <FilterBar />
        </Box>
      </Drawer>
    </>
  );
}

