import React, { useEffect, useState } from 'react';
import './CarCard.css';
import { useNavigate } from 'react-router-dom';
const CarCard = ({ vehicle, onReserve }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [durationDays, setDurationDays] = useState(0);
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(0);

  useEffect(() => {
    if (!vehicle.available) {
      setIsDropdownOpen(false);
    }
  }, [vehicle.available]);

  useEffect(() => {
    // Calculate duration and total price whenever dates change
    if (vehicle.pickUpDate && vehicle.dropOffDate) {
      const start = new Date(vehicle.pickUpDate);
      const end = new Date(vehicle.dropOffDate);
      const diffTime = Math.max(end - start, 0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDurationDays(diffDays);
      
      if (vehicle.price_per_day) {
        setCalculatedTotalPrice(vehicle.price_per_day * diffDays);
      }
    }
  }, [vehicle.pickUpDate, vehicle.dropOffDate, vehicle.price_per_day]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
  const handleReserve = async () => {
    if (!location.trim()) {
      alert('Le lieu de prise en charge est requis!');
      return;
    }
  
    navigate('/Checkout', {
      state: {
        ...vehicle, // Toutes les infos du véhicule
        durationDays,
        totalPrice: calculatedTotalPrice,
        lieuLocation: location,
        pickUpDate: vehicle.pickUpDate,
        dropOffDate: vehicle.dropOffDate
      }
    });
  };
  return (
    <div className="car-card">
      <div className="car-header" onClick={toggleDropdown}>
        <h3>{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
        <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isDropdownOpen && (
        <div className="car-details">
          <div className="car-image-container">
            <img 
              src={vehicle.image || 'default-vehicle.jpg'} 
              alt={`${vehicle.brand} ${vehicle.model}`} 
              className="car-image"
            />
          </div>
          
          <div className="car-specs">
            <div className="spec-row">
              <span className="spec-label">Type:</span>
              <span className="spec-value">{vehicle.type}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Seats:</span>
              <span className="spec-value">{vehicle.seats}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Transmission:</span>
              <span className="spec-value">{vehicle.transmission}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Fuel:</span>
              <span className="spec-value">{vehicle.fuel_type}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Kilometrage:</span>
              <span className="spec-value">{vehicle.kilometrage} KM/jour</span>
            </div>
          </div>
          
          <div className="car-policies">
            <div className="policy-item">
              <input 
                type="checkbox" 
                checked={vehicle.included_insurance} 
                readOnly 
              />
              <label>Insurance Included</label>
              <input 
                type="checkbox" 
                checked
                readOnly 
              />
              <label>Ancienneté minimale du permis : 3 ans</label>
            </div>
          
            <div className="policy-item">
              <span>Deposit: {vehicle.deposit} TND</span>
            </div>
            <div className="policy-item">
              <span>Cancellation Fee: {vehicle.cancellationFee} TND</span>
            </div>
          </div>
          
          <div className="car-features">
            <h4>Features:</h4>
            <ul>
              {vehicle.features && vehicle.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="car-pricing">
            <div className="price-row">
              <span>Price per day:</span>
              <span className="price-value">{vehicle.price_per_day} TND</span>
            </div>
            <div className="price-row">
              <span>Duration:</span>
              <span className="price-value">{durationDays} days</span>
            </div>
            <div className="price-row total">
              <span>Total:</span>
              <span className="price-value">{calculatedTotalPrice} TND</span>
            </div>
          </div>
          <div className="rental-period">
            <span>Période de location:</span>
            <div className="date-range">
              <span>De: {new Date(vehicle.pickUpDate).toLocaleDateString()}</span>
              <span>À: {new Date(vehicle.dropOffDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="rentalPlace">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu de prise en charge"
              required
            />
            <label>Lieu de prise en charge</label>
          </div>

          {vehicle.available && (
            <button 
              className="reserve-button" 
              onClick={handleReserve}
            >
              RESERVER
            </button>
          )}
          {!vehicle.available && (
        <div className="unavailability-alert">
          Ce véhicule n'est pas disponible
        </div>
      )}
          {vehicle.ratings && vehicle.ratings.length > 0 && (
            <div className="car-ratings">
              <span>Rating: </span>
              {Array(5).fill().map((_, i) => (
                <span key={i} className={`star ${i < Math.round(vehicle.ratings.reduce((a, b) => a + b, 0) / vehicle.ratings.length) ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
              <span>({vehicle.ratings.length})</span>
            </div>
          )}
        </div>
      )}
    </div>
  
  );
};

export default CarCard;
