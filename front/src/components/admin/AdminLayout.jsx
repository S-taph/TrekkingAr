"use client"

import { useState } from "react"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hiking as HikingIcon,
  PersonPin as GuideIcon,
  BookOnline as ReservasIcon,
} from "@mui/icons-material"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Usuarios", icon: <PeopleIcon />, path: "/admin/usuarios" },
  { text: "Viajes", icon: <HikingIcon />, path: "/admin/viajes" },
  { text: "Guías", icon: <GuideIcon />, path: "/admin/guias" },
  { text: "Reservas", icon: <ReservasIcon />, path: "/admin/reservas" },
]

export default function AdminLayout({ children, currentPath = "/admin", onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ bgcolor: "#f5f5f5", height: "100%" }}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <HikingIcon sx={{ color: "#1976d2" }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            TrekkingAR
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
              sx={{
                borderRadius: 2,
                my: 0.5,
                mx: 1,
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: "#fff" },
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "#000", // Texto negro al hacer hover sobre seleccionado
                    "& .MuiListItemIcon-root": { color: "#000" },
                  },
                },
                "&:hover": {
                  backgroundColor: currentPath === item.path ? "#1976d2" : "#e3f2fd",
                },
              }}
            >
              <ListItemIcon
                sx={{ color: currentPath === item.path ? "#fff" : "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Drawer para móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer permanente */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  )
}
