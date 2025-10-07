"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Badge,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import HikingIcon from "@mui/icons-material/Hiking"
import TourIcon from "@mui/icons-material/Tour"
import BackpackIcon from "@mui/icons-material/Backpack"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import ArticleIcon from "@mui/icons-material/Article"
import InfoIcon from "@mui/icons-material/Info"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LoginIcon from "@mui/icons-material/Login"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from "@mui/icons-material/Logout"
import ContactMailIcon from "@mui/icons-material/ContactMail"

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartCount] = useState(3)
  const [anchorEl, setAnchorEl] = useState(null)

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleMenuClose()
    navigate("/")
  }

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon /> },
    { text: "Trekkings", icon: <HikingIcon /> },
    { text: "Tours", icon: <TourIcon /> },
    { text: "Equipamiento", icon: <BackpackIcon /> },
    { text: "Galería", icon: <PhotoLibraryIcon /> },
    { text: "Blog", icon: <ArticleIcon /> },
    { text: "Nosotros", icon: <InfoIcon /> },
    { text: "Contacto", icon: <ContactMailIcon /> },
  ]

  return (
    <>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: alpha("#64b5f6", 0.95),
          boxShadow: theme.shadows[4],
          zIndex: theme.zIndex.appBar,
          padding: "0 1rem",
          margin: 0,
        })}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              mr: 2,
              display: { md: "none" },
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="img"
            src="/mountain.png"
            alt="Logo TrekkingAr"
            sx={{
              height: 40,
              width: "auto",
              marginRight: 2,
              userSelect: "none",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          />

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "'Russo One', sans-serif",
              fontWeight: "bold",
              letterSpacing: 1,
              flexGrow: 1,
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            TrekkingAr
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <Stack direction="row" spacing={1}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  startIcon={item.icon}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: 1000,
                    px: 1.5,
                    color: "white",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Stack>

            <IconButton
              sx={{
                ml: 2,
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 1,
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user.nombre} {user.apellido}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  ml: 1,
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="img" src="/mountain.png" alt="Logo" sx={{ height: 32, width: "auto" }} />
            <Typography variant="h6" sx={{ fontFamily: "'Russo One', sans-serif" }}>
              TrekkingAr
            </Typography>
          </Box>

          <List sx={{ pt: 0 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={toggleDrawer(false)}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          <Box sx={{ p: 2, bgcolor: "#f5f5f5", mt: "auto" }}>
            <Typography variant="body2" color="textSecondary" align="center">
              ¿Necesitas ayuda?
            </Typography>
            <Typography variant="body2" color="primary" align="center" sx={{ fontWeight: "bold" }}>
              +54 294 442-8765
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
