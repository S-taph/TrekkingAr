import { Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import CatalogPage from "./pages/CatalogPage"
import TripDetailPage from "./pages/TripDetailPage"
import CheckoutFlow from "./pages/CheckoutFlow"
import ProfilePage from "./pages/ProfilePage"
import MyReservationsPage from "./pages/MyReservationsPage"
import AdminApp from "./pages/AdminApp"
import AdminViajesPage from "./pages/admin/AdminViajesPage"
import AdminUsuariosPage from "./pages/admin/AdminUsuariosPage"
import AdminReservasPage from "./pages/admin/AdminReservasPage"

/**
 * Rutas centralizadas de la aplicación
 */
export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/catalogo",
    element: <CatalogPage />,
  },
  {
    path: "/viajes/:id",
    element: <TripDetailPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutFlow />,
    protected: true, // Requiere autenticación
  },
  {
    path: "/perfil",
    element: <ProfilePage />,
    protected: true,
  },
  {
    path: "/mis-reservas",
    element: <MyReservationsPage />,
    protected: true,
  },
  {
    path: "/admin",
    element: <AdminApp />,
    protected: true,
    adminOnly: true,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/viajes" replace />,
      },
      {
        path: "viajes",
        element: <AdminViajesPage />,
      },
      {
        path: "usuarios",
        element: <AdminUsuariosPage />,
      },
      {
        path: "reservas",
        element: <AdminReservasPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]
