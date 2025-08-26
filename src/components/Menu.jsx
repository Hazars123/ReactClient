import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Nav, Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './layout';
import CarCard from './client/CarCard';
import { fetchvehicles } from '../services/vehicleservice';
import { Alert, AlertTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  getUnreadCountUser,
  getUnreadNotificationsUser,
  markAllAsReadUser,
  markAsRead,
} from '../services/notificationService';


const Menu = () => {
  // États du composant
  const [searchData, setSearchData] = useState({
    brand: '',
    pickUpDate: '',
    dropOffDate: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const POLL_INTERVAL = 60_000; // 1 min (ajustez)

  // Configuration des intercepteurs Axios
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      setIsLoading(true);
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => {
        setIsLoading(false);
        return response;
      },
      error => {
        setIsLoading(false);
        throw error;
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

// Initialisation des dates
useEffect(() => {
  const today = new Date();
  const fourDaysLater = new Date(today);
  fourDaysLater.setDate(fourDaysLater.getDate() + 4);

  setSearchData(prev => ({
    ...prev,
    pickUpDate: today.toISOString().split('T')[0],
    dropOffDate: fourDaysLater.toISOString().split('T')[0]
  }));
}, []);

// Validation des dates
const validateDates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // On met l'heure à minuit pour comparer seulement les dates
  
  const pickup = new Date(searchData.pickUpDate);
  const dropoff = new Date(searchData.dropOffDate);
  setError(null); // Réinitialiser l'erreur avant la validation
  if (pickup < today) {
    setError('La date de prise en charge doit être supérieure ou égale à la date actuelle');
    return false;
  }
  if (pickup > dropoff) {
    setError('La date de retour doit être postérieure à la date de prise en charge');
    return false;
  }
  return true; // Validation réussie


}


  // Gestion des changements
  const handleChange = (e) => {
    setSearchData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Chargement des véhicules
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await fetchvehicles();
        const fetchedVehicles = response.data;

        if (fetchedVehicles && Array.isArray(fetchedVehicles)) {
          setVehicles(fetchedVehicles);
          const brands = [...new Set(fetchedVehicles.map(v => v.brand))];
          setUniqueBrands(brands);
        } else {
          setVehicles([]);
          setUniqueBrands([]);
        }
      } catch (err) {
        console.error('Erreur de chargement des véhicules:', err);
        setError('Erreur de chargement des données');
        setVehicles([]);
        setUniqueBrands([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      validateDates();
      const response = await fetch(`http://localhost:3001/api/vehicles/by-brand/${searchData.brand}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de recherche');
      }

      const vehiclesWithDates = data.map(vehicle => ({
        ...vehicle,
        pickUpDate: searchData.pickUpDate,
        dropOffDate: searchData.dropOffDate
      }));

      setVehicles(vehiclesWithDates);
      setShowVehicleDropdown(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCount = useCallback(async () => {
    try {
      const count = await getUnreadCountUser();
      setNotificationCount(count);
    } catch (e) {
      console.error('Erreur récupération compteur', e);
    }
  }, []);
  
  const fetchNotifications = useCallback(async () => {
    try {
      const list = await getUnreadNotificationsUser();
      setNotifications(list);
    } catch (e) {
      console.error('Erreur récupération notifications', e);
    }
  }, []);
  
  const handleOpen = async () => {
    const willOpen = !open;
    setOpen(willOpen);
  
    if (willOpen) {
      await fetchNotifications();
      await markAllAsReadUser();
      setNotificationCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };
  
  const handleReadOne = async (id) => {
    await markAsRead(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  /* ---------- Click-outside pour fermer ---------- */
  useEffect(() => {
    const outsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', outsideClick);
    return () => document.removeEventListener('mousedown', outsideClick);
  }, []);

  /* ---------- Chargement initial + polling ---------- */
  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchCount]);


  // Rendu conditionnel
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  
  return (
    <Layout>
     
    
    <div className="site-wrap" id="home-section">
  
      <div className="site-mobile-menu site-navbar-target">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle" />
          </div>  
          
        </div>
        <div className="site-mobile-menu-body" />
   
      </div>

      <div className="hero"
          style={{ backgroundImage: 'url("./src/assets/Template/assets/images/hero_1.jpg")' }}
>
        <div className="container">
          
          <div className="row align-items-center justify-content-center">
            
            <div className="col-lg-10">
              <div className="row mb-5"
              >
   <div className="notification-wrapper" ref={dropdownRef}>
  <button
    className={`notification-button ${notificationCount > 0 ? 'has-notifications' : ''}`}
    aria-label="Notifications"
    onClick={handleOpen}
  >
    <FontAwesomeIcon icon={faBell} />
    {notificationCount > 0 && (
      <span className={`notification-badge ${notificationCount > 9 ? 'high-count' : ''}`}>
        {notificationCount > 99 ? '99+' : notificationCount}
      </span>
    )}
  </button>

  {open && (
    <div className="notification-dropdown">
      {notifications.length === 0 ? (
        <div className="no-notif">
          <i className="empty-icon">🔔</i>
          <p>Aucune nouvelle notification</p>
        </div>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li
              key={n._id}
              className={n.read ? '' : 'notification-unread'}
              onClick={() => handleReadOne(n._id)}
            >
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</div>
                <div className="col-lg-7 intro">
                  <h1><strong>Rent a car</strong> is within your finger tips.</h1>
                </div>
              </div>
                <form className="trip-form" onSubmit={handleSubmit}>
                  <div className="row align-items-center">
                    <div className="mb-3 mb-md-0 col-md-3">
                      <select
                        name="brand"
                        value={searchData.brand}
                        onChange={handleChange}
                        className="custom-select form-control"
                        required
                        disabled={uniqueBrands.length === 0}
                      >
                        <option value="">Sélectionnez marque</option>
                        {uniqueBrands.map((brand, index) => (
                          <option key={`brand-${index}`} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      {uniqueBrands.length === 0 && (
                        <small className="text-danger">Aucune marque disponible</small>
                      )}
                    </div>

                    <div className="mb-3 mb-md-0 col-md-3">
                      <input
                        type="date"
                        name="pickUpDate"
                        value={searchData.pickUpDate}
                        onChange={handleChange}
                        className="form-control px-3"
                        required
                      />
                    </div>

                    <div className="mb-3 mb-md-0 col-md-3">
                      <input
                        type="date"
                        name="dropOffDate"
                        value={searchData.dropOffDate}
                        onChange={handleChange}
                        className="form-control px-3"
                        required
                      />
       
                    </div>
     
                    <div className="mb-3 mb-md-0 col-md-3">

                      <Button 
                        type="submit" 
                        className="bouton-rose"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Chargement...' : 'Rechercher'}
                      </Button>

                    </div>
       
                  </div>
                              
                </form>

                {error && (
                  <div className="alert alert-danger mt-4">
                    {error}
                  </div>
                )}

                {showVehicleDropdown && (
                  <div className="vehicles-list mt-4">
                    {vehicles.map(vehicle => (
                      <CarCard 
                        key={vehicle._id}
                        vehicle={{
                          ...vehicle,
                          pickUpDate: searchData.pickUpDate,
                          dropOffDate: searchData.dropOffDate
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;