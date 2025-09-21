"use client"

import { useState } from "react"
import AdminLayout from "../components/admin/AdminLayout"
import Dashboard from "../components/admin/Dashboard"
import ViajesManager from "../components/admin/ViajesManager"
import GuiasManager from "../components/admin/GuiasManager"
import ReservasManager from "../components/admin/ReservasManager"

export default function AdminApp() {
  const [currentPath, setCurrentPath] = useState("/admin")

  const handleNavigate = (path) => {
    setCurrentPath(path)
  }

  const renderContent = () => {
    switch (currentPath) {
      case "/admin":
        return <Dashboard onNavigate={handleNavigate} />
      case "/admin/usuarios":
        return <div>Gestión de Usuarios (próximamente)</div>
      case "/admin/viajes":
        return <ViajesManager />
      case "/admin/guias":
        return <GuiasManager />
      case "/admin/reservas":
        return <ReservasManager />
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminLayout currentPath={currentPath} onNavigate={handleNavigate}>
      {renderContent()}
    </AdminLayout>
  )
}
