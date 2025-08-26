import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "./button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faTimes, faHome, faFileAlt, 
  faEnvelope, faInfoCircle, faCalendarAlt, faStar
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@mui/material';
import { editprofile } from '../services/userservice';
import { faCar } from '@fortawesome/free-solid-svg-icons';
// Constants
const MAIN_MENU_ITEMS = [
  { path: "/Menu", icon: faHome, text: "Accueil" },
  { path: "/vehicules", icon: faCar, text: "Véhicules" }, // <-- ligne ajoutée
  { path: "/conditions", icon: faFileAlt, text: "Conditions" },
  { path: "/Contact", icon: faEnvelope, text: "Contact" },
  { path: "/About", icon: faInfoCircle, text: "À propos" },
  { path: "/Reservation", icon: faCalendarAlt, text: "Réservations" },
  { path: "/testimonials", icon: faStar, text: "Témoignages" } 
];

const INITIAL_FORM_DATA = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
};

const INITIAL_ALERT_STATE = {
  show: false,
  severity: 'success',
  message: ''
};

const Header = () => {
  // State management
  const [user, setUser] = useState(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [alert, setAlert] = useState(INITIAL_ALERT_STATE);
  // Refs
  const mainMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Initialize user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        ...INITIAL_FORM_DATA,
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    }
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideMainMenu = mainMenuRef.current && !mainMenuRef.current.contains(event.target);
      const isOutsideUserMenu = userMenuRef.current && !userMenuRef.current.contains(event.target);
      const isOutsideProfileMenu = profileMenuRef.current && !profileMenuRef.current.contains(event.target);

      if (isOutsideMainMenu) setIsMainMenuOpen(false);
      if (isOutsideUserMenu) setIsUserMenuOpen(false);
      if (isOutsideProfileMenu) setIsProfileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("CC_Token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsUserMenuOpen(false);
    window.location.href = "/Login";
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(false);
    setIsProfileMenuOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dataToSend = {
        ...(formData.firstname && { firstname: formData.firstname }),
        ...(formData.lastname && { lastname: formData.lastname }),
        ...(formData.email && { email: formData.email }),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.password && { 
          password: formData.password,
          confirmPassword: formData.confirmPassword 
        })
      };
  
      await editprofile(user._id, dataToSend);
    
      setAlert({
        show: true,
        severity: 'success',
        message: 'Profile updated successfully!'
      });
      
      // Update user in local storage
      const updatedUser = { ...user, ...dataToSend };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsProfileMenuOpen(false);
    } catch (error) {
      setAlert({
        show: true,
        severity: 'error',
        message: error.message || 'Error: Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle functions
  const toggleMainMenu = useCallback(() => {
    setIsMainMenuOpen(prev => !prev);
    setIsUserMenuOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
    setIsMainMenuOpen(false);
  }, []);

  // Helper components
  const MainMenu = () => (
    <div ref={mainMenuRef}>
      <div className="site-logo">
        <button 
          className="icon-button" 
          aria-label="Menu" 
          onClick={toggleMainMenu}
          aria-expanded={isMainMenuOpen}
        >
          <FontAwesomeIcon icon={isMainMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      
      {isMainMenuOpen && (
        <div className="menu-overlay active" onClick={toggleMainMenu} />
      )}
      
      <div className={`menu ${isMainMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Menu</h3>
        </div>
        
        <ul className="menu-list">
          {MAIN_MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                onClick={() => setIsMainMenuOpen(false)}
                className="menu-link"
              >
                <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const UserMenu = () => (
    <div ref={userMenuRef} className="relative ml-4">
      {alert.show && (
        <Alert 
          severity={alert.severity}
          onClose={() => setAlert(prev => ({...prev, show: false}))}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}
      
      <button
        onClick={toggleUserMenu}
        className={`bouton-rose ${
          user
            ? "border-purple-600 bg-purple-50 text-purple-600 hover:bg-purple-100"
            : "border-purple-500 text-purple-500 hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600"
        }`}
      >
        <UserPlus size={16} className="stroke-[2.5]" />
        {user ? user.firstname : "Connexion"}
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-md z-50">
          <div className="p-2">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bouton-rose w-full"
                >
                  Déconnexion
                </button>
                <div className="relative">
                  <button
                    onClick={handleProfileClick}
                    className="bouton-rose mt-2 w-full"
                  >
                    Modifier mon profil
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsUserMenuOpen(false)}>
                  <Button variant="outline" className="bouton-rose w-full">
                    <LogIn size={16} className="stroke-[2.5]" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsUserMenuOpen(false)}>
                  <Button className="bouton-rose w-full mt-2">
                    <UserPlus size={16} className="stroke-[2.5]" />
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
    
    
  );

  const ProfileMenu = () => (
    <div ref={profileMenuRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Account Details</h3>
          <button 
            onClick={() => setIsProfileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name</label>
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full p-2 border rounded"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                className="w-full p-2 border rounded"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  className="w-full p-2 border rounded"
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  className="w-full p-2 border rounded"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="bouton-rose w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <title>CarRental — Location de voitures premium</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
      
      <div className="site-wrap" id="home-section">
        <header className="site-navbar site-navbar-target bg-white shadow-sm" role="banner">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center py-3">
              <MainMenu />
              
              <div className="d-flex align-items-center">
              
                <UserMenu />
                {isProfileMenuOpen && <ProfileMenu />}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;       