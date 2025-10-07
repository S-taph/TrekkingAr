"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { usuariosAPI } from "../../services/api.js"

export default function UsuariosManager() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await usuariosAPI.getUsuarios()
      setUsuarios(data)
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
      setError(err.message || "Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { field: "id_usuarios", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "apellido", headerName: "Apellido", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "dni", headerName: "DNI", width: 120 },
    { field: "rol", headerName: "Rol", width: 120 },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: "#64b5f6" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadUsuarios} sx={{ ml: 2, color: "#64b5f6" }}>
          Reintentar
        </Button>
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: "#64b5f6" }}>
        Gestión de Usuarios
      </Typography>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={usuarios}
          columns={columns}
          getRowId={(row) => row.id_usuarios}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  )
}
