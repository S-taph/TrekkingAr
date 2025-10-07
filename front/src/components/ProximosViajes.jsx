import { Grid, Typography, Container } from "@mui/material";
import EventCard from "./EventCard";

const ProximosViajes = () => {
  const viajes = [
    {
      id: 1,
      title: "Ascenso al Cerro Tres Picos (Sierra de la Ventana) - por Funke",
      description:
        "Una aventura completa en solo un fin de semana en Sierra de la Ventana",
      date: "20/09/2025",
      category: "trekking",
      location: "Sierra de la Ventana",
      available: 10,
      image: "/src/assets/images/trekkings/tres-picos/trespicos1.jpg",
    },
    {
      id: 2,
      title: "Trekking en el Aconcagua",
      description: "Una experiencia única en la montaña más alta de América.",
      date: "10/10/2025",
      category: "trekking",
      location: "Mendoza",
      available: 5,
      image: "/src/assets/images/trekkings/aconcagua/aconcagua1.jpg",
    },
  ];

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        align="center"
      >
        Próximos Viajes
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
      >
        {viajes.map((viaje) => (
          <Grid item key={viaje.id} xs={12} sm={6} md={4}>
            <EventCard event={viaje} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProximosViajes;
