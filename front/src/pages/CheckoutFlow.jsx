import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material"
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material"
import Header from "../components/Header"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const steps = ["Resumen del Carrito", "Datos del Pasajero", "Pago", "Confirmación"]

/**
 * CheckoutFlow - Flujo de checkout por pasos
 */
export default function CheckoutFlow() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()

  const [activeStep, setActiveStep] = useState(0)
  const [passengerData, setPassengerData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    dni: user?.dni || "",
    direccion: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: "",
  })
  const [errors, setErrors] = useState({})
  const [reservationNumber, setReservationNumber] = useState(null)

  useEffect(() => {
    document.title = "Checkout - TrekkingAR"

    // Si el carrito está vacío, redirigir
    if (items.length === 0 && activeStep === 0) {
      navigate("/catalogo")
    }
  }, [items, activeStep, navigate])

  const handleNext = () => {
    // Validar según el paso actual
    if (activeStep === 1 && !validatePassengerData()) {
      return
    }

    if (activeStep === 2 && !validatePaymentData()) {
      return
    }

    // Paso 3: Procesar pago y crear reserva
    if (activeStep === 2) {
      processCheckout()
    }

    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const validatePassengerData = () => {
    const newErrors = {}

    if (!passengerData.nombre) newErrors.nombre = "Nombre requerido"
    if (!passengerData.apellido) newErrors.apellido = "Apellido requerido"
    if (!passengerData.email) newErrors.email = "Email requerido"
    if (!passengerData.telefono) newErrors.telefono = "Teléfono requerido"
    if (!passengerData.dni) newErrors.dni = "DNI requerido"

    // Validar formato email
    if (passengerData.email && !/\S+@\S+\.\S+/.test(passengerData.email)) {
      newErrors.email = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentData = () => {
    if (paymentMethod === "pay_later") return true

    const newErrors = {}

    if (!cardData.numero || cardData.numero.length < 16) {
      newErrors.numero = "Número de tarjeta inválido"
    }
    if (!cardData.nombre) newErrors.nombre = "Nombre requerido"
    if (!cardData.vencimiento) newErrors.vencimiento = "Vencimiento requerido"
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processCheckout = async () => {
    try {
      // TODO: Integrar con POST /api/carrito/checkout
      // Simular creación de reserva
      const mockReservationNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setReservationNumber(mockReservationNumber)

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Limpiar carrito
      await clearCart()
    } catch (error) {
      console.error("Error procesando checkout:", error)
    }
  }

  const handlePassengerChange = (field, value) => {
    setPassengerData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCardChange = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Renderizado de cada paso
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepCartSummary items={items} totalPrice={totalPrice} />

      case 1:
        return (
          <StepPassengerData
            data={passengerData}
            errors={errors}
            onChange={handlePassengerChange}
          />
        )

      case 2:
        return (
          <StepPayment
            paymentMethod={paymentMethod}
            cardData={cardData}
            errors={errors}
            onMethodChange={setPaymentMethod}
            onCardChange={handleCardChange}
          />
        )

      case 3:
        return <StepConfirmation reservationNumber={reservationNumber} />

      default:
        return null
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Finalizar Reserva
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso actual */}
        <Paper sx={{ p: 4, mb: 3 }}>{renderStepContent(activeStep)}</Paper>

        {/* Botones de navegación */}
        {activeStep < steps.length - 1 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep === 2 ? <CheckCircle /> : <ArrowForward />}
            >
              {activeStep === 2 ? "Confirmar Pago" : "Continuar"}
            </Button>
          </Box>
        )}

        {activeStep === steps.length - 1 && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/mis-reservas")}
            >
              Ver Mis Reservas
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Componentes de cada paso
function StepCartSummary({ items, totalPrice }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Resumen de tu compra
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={item.viaje?.titulo || "Viaje"}
              secondary={`Fecha: ${new Date(item.fecha_viaje?.fecha_inicio).toLocaleDateString()} • Cantidad: ${item.cantidad}`}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ${(item.precio_unitario * item.cantidad).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Total
        </Typography>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
          ${totalPrice.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}

function StepPassengerData({ data, errors, onChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Datos del Pasajero Principal
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            value={data.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            value={data.apellido}
            onChange={(e) => onChange("apellido", e.target.value)}
            error={Boolean(errors.apellido)}
            helperText={errors.apellido}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            value={data.telefono}
            onChange={(e) => onChange("telefono", e.target.value)}
            error={Boolean(errors.telefono)}
            helperText={errors.telefono}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="DNI"
            value={data.dni}
            onChange={(e) => onChange("dni", e.target.value)}
            error={Boolean(errors.dni)}
            helperText={errors.dni}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección (opcional)"
            value={data.direccion}
            onChange={(e) => onChange("direccion", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

function StepPayment({ paymentMethod, cardData, errors, onMethodChange, onCardChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Método de Pago
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup value={paymentMethod} onChange={(e) => onMethodChange(e.target.value)}>
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Tarjeta de crédito/débito"
          />
          <FormControlLabel
            value="pay_later"
            control={<Radio />}
            label="Pagar más tarde (reservar con seña del 30%)"
          />
        </RadioGroup>
      </FormControl>

      {paymentMethod === "card" && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número de tarjeta"
              placeholder="1234 5678 9012 3456"
              value={cardData.numero}
              onChange={(e) => onCardChange("numero", e.target.value.replace(/\s/g, ""))}
              error={Boolean(errors.numero)}
              helperText={errors.numero}
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre en la tarjeta"
              value={cardData.nombre}
              onChange={(e) => onCardChange("nombre", e.target.value)}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vencimiento (MM/AA)"
              placeholder="12/25"
              value={cardData.vencimiento}
              onChange={(e) => onCardChange("vencimiento", e.target.value)}
              error={Boolean(errors.vencimiento)}
              helperText={errors.vencimiento}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              value={cardData.cvv}
              onChange={(e) => onCardChange("cvv", e.target.value)}
              error={Boolean(errors.cvv)}
              helperText={errors.cvv}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
        </Grid>
      )}

      {paymentMethod === "pay_later" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Se enviará un email con las instrucciones para completar el pago. La reserva quedará
          confirmada al abonar la seña del 30%.
        </Alert>
      )}

      <Alert severity="success" sx={{ mt: 3 }}>
        ✓ Transacción segura • Protección de datos
      </Alert>
    </Box>
  )
}

function StepConfirmation({ reservationNumber }) {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        ¡Reserva Confirmada!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tu reserva ha sido procesada exitosamente
      </Typography>
      {reservationNumber && (
        <Paper sx={{ p: 2, bgcolor: "action.hover", display: "inline-block", mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Número de reserva
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {reservationNumber}
          </Typography>
        </Paper>
      )}
      <Typography variant="body2" color="text.secondary">
        Recibirás un email con los detalles de tu reserva y próximos pasos.
      </Typography>
    </Box>
  )
}
