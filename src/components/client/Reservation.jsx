import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../layout';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const stripePromise = loadStripe('pk_test_51R3bMAFztBNRnYHsZYCJRpLfsx6bvMw6ElWB94WDEo87C5NJ5mb5SvyfEnN8kDzJOJtLTfVt9bOSeuPgCgBClHOh00oPZoDDh4');

const Reservation = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [recommendations, setRecommendations] = useState([]);
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
const [showRecommendation, setShowRecommendation] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'Toutes les réservations' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'pending', label: 'En attente' },
    { value: 'cancelled', label: 'Annulées' }
  ];

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/bookings/bookUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data.bookings);
      setFilteredBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filter));
    }
  }, [filter, bookings]);
  useEffect(() => {
    fetchBookings();
    fetchPersonalizedRecommendations(); // Ajoutez cet appel
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBookings();
        fetchPersonalizedRecommendations(); // Rafraîchir aussi les recommandations
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (recommendations.length === 0) return;
  
    // Afficher la première recommandation après 3 secondes
    const initialTimer = setTimeout(() => {
      setShowRecommendation(true);
    }, 3000);
  
    // Configurer l'intervalle pour faire défiler les recommandations
    const interval = setInterval(() => {
      setShowRecommendation(false);
      
      // Petit délai pour permettre l'animation de disparition
      setTimeout(() => {
        setCurrentRecommendationIndex(prev => 
          (prev + 1) % recommendations.length
        );
        setShowRecommendation(true);
      }, 500);
    }, 60000); // 60 secondes (1 minute)
  
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [recommendations.length]);
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      setProcessingPayment(bookingId);
      const token = localStorage.getItem('token');
      
      // Créer la session de paiement
      const response = await axios.post(
        `/payment/create-checkout-session/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mettre à jour le statut localement immédiatement
      setBookings(bookings.map(b => 
        b._id === bookingId ? {...b, payment_status: 'processing'} : b
      ));

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) throw error;

      // Si le paiement est réussi, mettre à jour le statut
      await axios.put(
        `/payment/${bookingId}/payment-status`,
        { payment_status: 'paid' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Rafraîchir les données après le paiement
      await fetchBookings();

    } catch (error) {
      let errorMessage = 'Erreur lors du traitement du paiement';
      
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText;
      } else if (error.request) {
        errorMessage = 'Pas de réponse du serveur';
      } else {
        errorMessage = error.message;
      }

      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      setBookings(bookings.map(b => 
        b._id === bookingId ? {...b, payment_status: 'failed'} : b
      ));
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/bookings/${bookingId}`, 
        { status: 'annulée' }, // Changé de 'cancelled' à 'annulée'
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBookings(bookings.map(b => 
        b._id === bookingId ? {...b, status: 'annulée'} : b // Aussi ici
      ));
      setSnackbar({ open: true, message: 'Réservation annulée avec succès', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de l\'annulation', severity: 'error' });
    }
  };
  

  const handleOpenReviewDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setRating(5);
    setReviewText('');
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/review/${currentBooking._id}`, // Utilisez l'endpoint correct
        {
          rating,
          comment: reviewText
        }, 
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
  
      setSnackbar({ 
        open: true, 
        message: 'Avis soumis avec succès', 
        severity: 'success' 
      });
      
      // Mettre à jour la réservation pour indiquer qu'un avis a été donné
      setBookings(bookings.map(b => 
        b._id === currentBooking._id ? {...b, hasReview: true} : b
      ));
      
      handleCloseReviewDialog();
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Erreur lors de la soumission de l\'avis', 
        severity: 'error' 
      });
    }
  };
  const fetchPersonalizedRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/recommendation/personalized', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecommendations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Vous pouvez choisir de gérer l'erreur ou simplement ignorer
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <br /><br /><br />
      <div className="reservation-container">
        <header className="reservation-header">
          <h1 className="reservation-title">Mes Réservations</h1>
          <p className="reservation-subtitle">Gérez vos locations de véhicules</p>
        </header>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="empty-title">Aucune réservation</h3>
            <button
              onClick={() => navigate('/menu')}
              className="primary-button"
            >
              Trouver un véhicule
            </button>
          </div>
        ) : (
          <>
            <div className="filter-container">
              <h3 className="filter-title">
                {filteredBookings.length} réservation{filteredBookings.length > 1 ? 's' : ''}
              </h3>
              
              <div className="dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="dropdown-button"
                >
                  {statusOptions.find(opt => opt.value === filter)?.label}
                  <ArrowDropDownIcon className="dropdown-icon" />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilter(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`dropdown-item ${filter === option.value ? 'active' : ''}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="booking-grid">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    {booking.vehicle_id?.image && (
                      <img
                        className="vehicle-image"
                        src={booking.vehicle_id.image}
                        alt={`${booking.vehicle_id.brand} ${booking.vehicle_id.model}`}
                      />
                    )}
                    <div className="booking-info">
                      <h4 className="vehicle-name">
                        {booking.vehicle_id?.brand || booking.brand} {booking.vehicle_id?.model || booking.model}
                      </h4>
                      <p className="vehicle-year">
                        Année: {booking.vehicle_id?.year || booking.year}
                      </p>
                      <span className={`status-badge ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-footer">
                    <div className="booking-meta">
                      <div className="booking-dates">
                        <p>Du {formatDate(booking.start_date)}</p>
                        <p>Au {formatDate(booking.end_date)}</p>
                      </div>
                      <div className="booking-price">
                        {booking.total_price} TND
                      </div>
                    </div>

                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="cancel-button"
                        >
                          Annuler
                        </button>
                      )}

                      {booking.status === 'confirmed' && !booking.hasReview && (
                        <button
                          onClick={() => handleOpenReviewDialog(booking)}
                          className="review-button"
                        >
                          Donner un avis
                        </button>
                      )}

                      {/* Bouton de paiement conditionnel */}
                      {booking.status === 'confirmed' && 
                       (booking.payment_method === 'Stripe' || booking.payment_method === 'Floci') && (
                        booking.payment_status === 'paid' ? (
                          <div className="payment-status paid">
                            <span>Payé</span>
                          </div>
                        ) : booking.payment_status === 'processing' ? (
                          <button className="payment-button processing">
                            <span className="spinner"></span>
                            Traitement...
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePayment(booking._id)}
                            disabled={processingPayment === booking._id}
                            className="payment-button"
                          >
                            Payer maintenant
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
          {recommendations.length > 0 && showRecommendation && (
  <div className={`recommendation-popup ${showRecommendation ? 'visible' : ''}`}>
    <button 
      className="close-popup"
      onClick={() => setShowRecommendation(false)}
    >
      ×
    </button>
    
    <div 
      className="popup-content"
      onClick={() => navigate(`/menu`)}
    >
      <img
        src={recommendations[currentRecommendationIndex].image}
        alt={`${recommendations[currentRecommendationIndex].brand} ${recommendations[currentRecommendationIndex].model}`}
        className="popup-image"
      />
      <div className="popup-info">
        <h4>{recommendations[currentRecommendationIndex].brand} {recommendations[currentRecommendationIndex].model}</h4>
        <div className="popup-meta">
          <Rating 
            value={recommendations[currentRecommendationIndex].ratings?.average || 0} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          <span>{recommendations[currentRecommendationIndex].price_per_day} TND/jour</span>
        </div>
        <p className="popup-text">Nous pensons que ce véhicule pourrait vous plaire !</p>
      </div>
    </div>
  </div>
)}
            </div>
          </>
        )}

        {/* Review Dialog */}
        <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
          <DialogTitle>Donner votre avis</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Rating
                name="review-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={0.5}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <TextField
                label="Votre commentaire"
                multiline
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog}>Annuler</Button>
            <Button onClick={handleSubmitReview} color="primary">Soumettre</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </Layout>
  );
};

export default Reservation;