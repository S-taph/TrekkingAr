"use client"

import { useState, useCallback } from "react"
import { Container, Box, Button, Drawer, Typography } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"

import Header from "../components/Header.jsx"
import Banner from "../components/Banner.jsx"
import FilterBar from "../components/FilterBar.jsx"
import ProductList from "../components/ProductList.jsx"
import Hero from "../components/Hero.jsx"
import Footer from "../components/Footer.jsx"
import ProximosViajes from "../components/ProximosViajes.jsx"
import MediosPago from "../components/MediosPago.jsx"
import SearchBar from "../components/SearchBar.jsx"
import ExperienciasDestacadas from "../components/ExperienciasDestacadas.jsx"
import ReviewsList from "../components/ReviewsList.jsx"

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState({})
  const [sidebarFilters, setSidebarFilters] = useState({})

  const toggleFilterDrawer = (open) => () => setFilterOpen(open)

  const handleSearch = useCallback((filters) => {
    console.log("[v0] Búsqueda aplicada:", filters)
    setSearchFilters(filters)
  }, [])

  const handleSidebarFilter = useCallback((filters) => {
    console.log("[v0] Filtros sidebar aplicados:", filters)
    setSidebarFilters(filters)
  }, [])

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* HERO PRINCIPAL CON CTA */}
      <Box sx={{ position: "relative", mt: { xs: 8, md: 0 }, mb: 6 }}>
        <Hero />
      </Box>

      {/* BANNER DESTACADO */}
      <Box sx={{ mt: 4, mb: 8 }}>
        <Banner />
      </Box>

      {/* CONTENEDOR PRINCIPAL */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        {/* BARRA DE BÚSQUEDA */}
        <Box sx={{ mb: 4 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>

        {/* BOTÓN FILTRO EN MÓVIL */}
        <Box sx={{ mb: 3, display: { xs: "flex", md: "none" }, justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={toggleFilterDrawer(true)}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Filtrar
          </Button>
        </Box>

        {/* PRODUCTOS + FILTROS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* FILTROS desktop */}
          <Box sx={{ width: 300, display: { xs: "none", md: "block" } }}>
            <FilterBar onFilterChange={handleSidebarFilter} />
          </Box>

          {/* PRODUCT LIST */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
              Nuestros Viajes
            </Typography>
            <ProductList searchFilters={searchFilters} sidebarFilters={sidebarFilters} />
          </Box>
        </Box>

        {/* PRÓXIMOS VIAJES */}
        <Box sx={{ mt: 12 }}>
          <ProximosViajes />
        </Box>
      </Container>

      {/* EXPERIENCIAS DESTACADAS */}
      <ExperienciasDestacadas />

      <Container maxWidth="lg">
        {/* MEDIOS DE PAGO */}
        <MediosPago />
      </Container>

      {/* REVIEWS & COMENTARIOS */}
      <ReviewsList limit={6} />

      {/* FOOTER */}
      <Footer />

      {/* DRAWER FILTROS MOBILE */}
      <Drawer anchor="right" open={filterOpen} onClose={toggleFilterDrawer(false)} ModalProps={{ keepMounted: true }}>
        <Box sx={{ width: 280, p: 2 }}>
          <FilterBar onFilterChange={handleSidebarFilter} />
        </Box>
      </Drawer>
    </>
  )
}
