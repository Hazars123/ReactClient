import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';
import Layout from '../layout';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';


const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    reservationData: null,
    paymentMethod: '',
    isDropdownOpen: true,
    openConfirmation: false,
    isProcessing: false,
    error: null,
    isDataValid: false
  });

  useEffect(() => {
    const validateData = () => {
      if (!location.state) {
        setState(prev => ({ ...prev, error: "Missing reservation data", isDataValid: false }));
        return;
      }

      const requiredFields = [
        'brand', 'model', 'pickUpDate', 
        'dropOffDate', 'totalPrice', 'lieuLocation'
      ];
      const missingFields = requiredFields.filter(field => !location.state[field]);

      if (missingFields.length > 0) {
        setState(prev => ({
          ...prev,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          isDataValid: false
        }));
        return;
      }

      // Try multiple ways to get vehicleId
      const vehicleId = location.state.vehicleId || 
                       location.state._id || 
                       (location.state.vehicle && location.state.vehicle._id);

      if (!vehicleId) {
        setState(prev => ({
          ...prev,
          error: "Vehicle ID not found",
          isDataValid: false
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        reservationData: {
          ...location.state,
          vehicleId // Ensure vehicleId is set
        },
        isDataValid: true,
        error: null
      }));
    };

    validateData();
  }, [location.state]);

  const handleStateChange = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handlePaymentChange = (event) => {
    handleStateChange({ paymentMethod: event.target.value });
  };

  const handleConfirmReservation = () => {
    if (!state.paymentMethod) {
      handleStateChange({ error: 'Please select payment method' });
      return;
    }
    handleStateChange({ openConfirmation: true });
  };

  const handleReservationSubmit = async () => {
    if (!state.isDataValid || !state.reservationData?.vehicleId) {
      handleStateChange({ error: 'Invalid reservation data' });
      return;
    }

    handleStateChange({ isProcessing: true, error: null });
    
    try {
      const { vehicleId, pickUpDate, dropOffDate, totalPrice, lieuLocation } = state.reservationData;
      const response = await axios.post(
        `bookings/${vehicleId}`,
        {
          start_date: pickUpDate,
          end_date: dropOffDate,
          total_price: totalPrice,
          lieuLocation,
          payment_method: state.paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        navigate('/ReservationSuccess', { 
          state: { 
            booking: response.data,
            vehicle: { 
              brand: state.reservationData.brand,
              model: state.reservationData.model,
              year: state.reservationData.year,
              image: state.reservationData.image 
            }
          } 
        });
      }
    } catch (err) {
      console.error('Reservation error:', err);
      handleStateChange({ 
        error: err.response?.data?.message || 'Reservation failed. Please try again.' 
      });
    } finally {
      handleStateChange({ 
        isProcessing: false, 
        openConfirmation: false 
      });
    }
  };

  if (!state.isDataValid) {
    return (
      <Layout>
        <div className="error-container">
          <h3>Reservation Error</h3>
          <p>{state.error || 'Invalid reservation data'}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/vehicles')}
          >
            Back to Vehicle Selection
          </button>
        </div>
      </Layout>
    );
  }

  const { 
    reservationData, 
    paymentMethod, 
    isDropdownOpen, 
    openConfirmation, 
    isProcessing, 
    error 
  } = state;

  return (
    <Layout>
      <div className="checkout-container">
        <div className="checkout-card">
          {/* Vehicle Summary Section */}
          <div className="reservation-options">
            <div 
              className="car-header" 
              onClick={() => handleStateChange({ isDropdownOpen: !isDropdownOpen })}
            >
              <h3>{reservationData.brand} {reservationData.model} ({reservationData.year})</h3>
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>
            
            {isDropdownOpen && (
              <div className="car-details">
                <div className="car-image-container">
                  <img
                    src={reservationData.image || 'default-vehicle.jpg'}
                    alt={`${reservationData.brand} ${reservationData.model}`}
                    className="car-image"
                  />
                </div>
                
                <div className="car-pricing">
                  <div className="price-row">
                    <span>Daily Price:</span>
                    <span className="price-value">{reservationData.price_per_day} TND</span>
                  </div>
                  <div className="price-row">
                    <span>Duration:</span>
                    <span className="price-value">{reservationData.durationDays} days</span>
                  </div>
                  <div className="price-row total">
                    <span>Total:</span>
                    <span className="price-value">{reservationData.totalPrice} TND</span>
                  </div>
                </div>
                
                <div className="rental-period">
                  <span>Rental Period:</span>
                  <div className="date-range">
                    <span>From: {new Date(reservationData.pickUpDate).toLocaleDateString()}</span>
                    <span>To: {new Date(reservationData.dropOffDate).toLocaleDateString()}</span>
                  </div>
                  <span>Pickup Location: {reservationData.lieuLocation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Options Section */}
          <div className="payment-options">
            <h3>Payment Methods</h3>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment-options"
                name="payment-options"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <FormControlLabel 
                  value="Stripe" 
                  control={<Radio />} 
                  label="Credit Card (Stripe)" 
                />
                
                <FormControlLabel 
                  value="cash" 
                  control={<Radio />} 
                  label="Cash (At Agency)" 
                />
              </RadioGroup>
            </FormControl>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            className="reserve-button"
            onClick={handleConfirmReservation}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Confirm Reservation'
            )}
          </button>

          {/* Confirmation Dialog */}
          <Dialog
            open={openConfirmation}
            onClose={() => handleStateChange({ openConfirmation: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Reservation</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Confirm reservation for {reservationData.brand} {reservationData.model} from {new Date(reservationData.pickUpDate).toLocaleDateString()} to {new Date(reservationData.dropOffDate).toLocaleDateString()}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => handleStateChange({ openConfirmation: false })} 
                color="primary"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReservationSubmit} 
                color="primary" 
                autoFocus
                disabled={isProcessing}
              >
                {isProcessing ? <CircularProgress size={24} /> : 'Confirm'}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;