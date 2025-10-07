"use client"

import { useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import products from "../data/productsWithTags.js"
import ProductCard from "./ProductCard"

const ProductList = ({ searchFilters = {}, sidebarFilters = {} }) => {
  console.log("[v0] ProductList recibió searchFilters:", searchFilters)
  console.log("[v0] ProductList recibió sidebarFilters:", sidebarFilters)

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Aplicar filtros de búsqueda
    if (searchFilters.lugar && searchFilters.lugar.trim() !== "") {
      const lugarLower = searchFilters.lugar.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(lugarLower) || product.location.toLowerCase().includes(lugarLower),
      )
    }

    if (searchFilters.dificultad && searchFilters.dificultad !== "") {
      filtered = filtered.filter((product) => product.difficulty?.toLowerCase() === searchFilters.dificultad)
    }

    if (searchFilters.dias && searchFilters.dias !== "") {
      const dias = Number.parseInt(searchFilters.dias)
      filtered = filtered.filter((product) => product.duration === dias)
    }

    // Aplicar filtros del sidebar
    if (sidebarFilters.category && sidebarFilters.category.length > 0) {
      filtered = filtered.filter((product) => sidebarFilters.category.includes(product.category))
    }

    if (sidebarFilters.difficulty && sidebarFilters.difficulty.length > 0) {
      filtered = filtered.filter((product) => sidebarFilters.difficulty.includes(product.difficulty))
    }

    if (sidebarFilters.priceRange) {
      const [min, max] = sidebarFilters.priceRange
      filtered = filtered.filter((product) => product.price >= min && product.price <= max)
    }

    console.log("[v0] Productos filtrados:", filtered.length, "de", products.length)
    return filtered
  }, [searchFilters, sidebarFilters])

  if (filteredProducts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No se encontraron viajes con los filtros seleccionados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        justifyContent: "center",
      }}
    >
      {filteredProducts.map((prod) => (
        <ProductCard key={prod.id} product={prod} />
      ))}
    </Box>
  )
}

export default ProductList
