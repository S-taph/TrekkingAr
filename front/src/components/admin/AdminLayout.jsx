"use client";

import { useState } from "react";
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
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hiking as HikingIcon,
  PersonPin as GuideIcon,
  BookOnline as ReservasIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Usuarios", icon: <PeopleIcon />, path: "/admin/usuarios" },
  { text: "Viajes", icon: <HikingIcon />, path: "/admin/viajes" },
  { text: "Guías", icon: <GuideIcon />, path: "/admin/guias" },
  { text: "Reservas", icon: <ReservasIcon />, path: "/admin/reservas" },
];

export default function AdminLayout({ children, currentPath = "/admin", onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box
      sx={{
        bgcolor: "#1E1E2F",
        color: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* HEADER DEL SIDEBAR */}
      <Box>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={1}>
            <HikingIcon sx={{ color: "#90CAF9" }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              TrekkingAR
            </Typography>
          </Box>
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* MENÚ DE NAVEGACIÓN */}
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const selected = currentPath === item.path;
            return (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      color: selected ? "#fff" : "rgba(255,255,255,0.8)",
                      backgroundColor: selected ? "#1976d2" : "transparent",
                      "&:hover": {
                        backgroundColor: selected ? "#1565c0" : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: selected ? "#fff" : "rgba(255,255,255,0.7)",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: selected ? "bold" : 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* PERFIL Y LOGOUT */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>A</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Admin
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              admin@trekkingar.com
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          sx={{
            mt: 2,
            borderRadius: 2,
            color: "#f44336",
            "&:hover": { backgroundColor: "rgba(244,67,54,0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "#f44336", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F6FA" }}>
      {/* AppBar superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#fff",
          color: "#333",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            Panel de Administración
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component={motion.main}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
