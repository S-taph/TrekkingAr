"use client"

import { useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "./theme"
import Home from "./pages/Home"
import AdminApp from "./pages/AdminApp"

export default function App() {
  const [currentApp, setCurrentApp] = useState("home") // 'home' o 'admin'

  const renderApp = () => {
    if (window.location.pathname.startsWith("/admin")) {
      return <AdminApp />
    }
    return <Home />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderApp()}
    </ThemeProvider>
  )
}
