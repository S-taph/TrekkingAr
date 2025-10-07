import { 
  Box, 
  Typography, 
  Grid, 
  useTheme, 
  useMediaQuery, 
  Container
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const MediosPago = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const beneficios = [
    {
      title: 'Todos los Medios de Pago',
      subtitle: 'Mediante Mercado Pago',
      icon: <CreditCardIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Pagá en 3 y 6 Cuotas fijas',
      subtitle: 'Cuota Simple',
      icon: <PaymentsIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: '4 Cuotas Sin Interés',
      subtitle: 'Con Tarjeta Cordobesa',
      icon: <LocalAtmIcon color="primary" sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper',
        py: 4,
        mt: 4,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {beneficios.map((beneficio, index) => (
            <Grid item xs={12} md={4} key={index} sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {beneficio.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem' }}
                >
                  {beneficio.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                >
                  {beneficio.subtitle}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MediosPago;