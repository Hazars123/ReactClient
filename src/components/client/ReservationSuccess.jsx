import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import emailjs from 'emailjs-com';

const ReservationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, vehicle } = location.state || {};
  
  // Fallback data if state isn't passed
  const reservationData = booking || {
    _id: 'BOOK-123456',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    total_price: 450,
    lieuLocation: 'Downtown Agency',
    payment_method: 'Stripe'
  };

  const vehicleData = vehicle || {
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    image: '/default-car.jpg'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewReservation = () => {
    navigate('/menu');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Calculate rental duration in days
  const rentalDays = Math.ceil(
    (new Date(reservationData.end_date) - new Date(reservationData.start_date)) / (1000 * 60 * 60 * 24)
  );

  // Send confirmation email
  React.useEffect(() => {
    if (booking && booking.customerEmail) {
      emailjs.send(
        'your_email_service_id',
        'your_template_id',
        {
          to_email: booking.customerEmail,
          reservation_id: booking._id,
          vehicle: `${vehicleData.brand} ${vehicleData.model}`,
          pickup_date: new Date(reservationData.start_date).toLocaleDateString(),
          return_date: new Date(reservationData.end_date).toLocaleDateString(),
          total_price: reservationData.total_price,
          location: reservationData.lieuLocation
        },
        'your_user_id'
      ).catch(err => console.error('Email sending failed:', err));
    }
  }, [booking, vehicleData, reservationData]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
          <Typography variant="h4" component="h1" gutterBottom>
           Success Reservation !
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your reservation ID: <strong>{reservationData._id}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            We've sent a confirmation to your email with all the details.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Vehicle Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CarIcon color="primary" sx={{ mr: 1 }} />
                Vehicle Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={vehicleData.image}
                  alt={`${vehicleData.brand} ${vehicleData.model}`}
                  sx={{ 
                    width: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain',
                    mb: 2,
                    borderRadius: 1
                  }}
                />
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Brand & Model" 
                      secondary={`${vehicleData.brand} ${vehicleData.model}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Year" secondary={vehicleData.year} />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>

          {/* Rental Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                Rental Period
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Pickup Date" 
                    secondary={new Date(reservationData.start_date).toLocaleDateString()} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Return Date" 
                    secondary={new Date(reservationData.end_date).toLocaleDateString()} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Duration" secondary={`${rentalDays} days`} />
                </ListItem>
                <Divider component="li" sx={{ my: 1 }} />
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Pickup Location" 
                    secondary={reservationData.lieuLocation} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Payment Summary */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon color="primary" sx={{ mr: 1 }} />
                Payment Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Subtotal" secondary={`${reservationData.total_price} TND`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Taxes (10%)" secondary={`${reservationData.total_price * 0.1} TND`} />
                </ListItem>
                <Divider component="li" sx={{ my: 1 }} />
                <ListItem sx={{ fontWeight: 'bold' }}>
                  <ListItemText 
                    primary="Total Amount" 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    secondary={`${reservationData.total_price * 1.1} TND`}
                    secondaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Payment Method" 
                    secondary={reservationData.payment_method} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            size="large"
          >
            Print Confirmation
          </Button>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBackToHome}
            size="large"
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            onClick={handleNewReservation}
            size="large"
          >
            New Reservation
          </Button>
        </Box>

        {/* Help Section */}
        <Box sx={{ mt: 5, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Contact our customer service at <strong>support@carrental.com</strong> or call us at <strong>(123) 456-7890</strong> if you have any questions.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default ReservationSuccess;