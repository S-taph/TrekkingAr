import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import IconButton from "@mui/material/IconButton"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"

const Footer = () => (
  <Box sx={{ bgcolor: "#2c3e50", color: "white", py: 6, mt: 4 }}>
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Información de la empresa */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            TrekkingAR
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
            Tu aventura comienza aquí. Descubre los paisajes más increíbles de Argentina con nuestros tours de trekking
            y turismo aventura.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton sx={{ color: "#3b5998" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: "#e4405f" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ color: "#25d366" }}>
              <WhatsAppIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Enlaces rápidos */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            Enlaces Rápidos
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="#" color="inherit" underline="hover">
              Inicio
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Trekkings
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Tours
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Equipamiento
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Galería
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Blog
            </Link>
          </Box>
        </Grid>

        {/* Métodos de Pago */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            Métodos de Pago
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadopago/logo_mp_blue.svg"
                alt="MercadoPago"
                sx={{ height: 20, width: "auto" }}
              />
              <Typography variant="body2">MercadoPago</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountBalanceIcon fontSize="small" />
              <Typography variant="body2">Transferencia Bancaria</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CreditCardIcon fontSize="small" />
              <Typography variant="body2">Todas las Tarjetas</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "#bdc3c7", mt: 1 }}>
              Visa • Mastercard • American Express
            </Typography>
          </Box>
        </Grid>

        {/* Información de contacto */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            Contacto
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">Av. San Martín 1234, Bariloche, Argentina</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">+54 294 442-8765</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WhatsAppIcon fontSize="small" />
              <Typography variant="body2">+54 9 294 456-7890</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" />
              <Typography variant="body2">info@trekking-ar.com</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Línea divisoria y copyright */}
      <Box sx={{ borderTop: "1px solid #34495e", mt: 4, pt: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="inherit">
              © 2025 TrekkingAR. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Términos y Condiciones
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Política de Privacidad
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
)

export default Footer
