import axios from "../api/axios";
const BOOKING_API = "bookings"; // Assuming the bookings endpoint is 'bookings'

// Fonction asynchrone pour récupérer toutes les réservations
export const fetchBookings = async () => {
    return await axios.get(BOOKING_API); // Envoi d'une requête GET pour obtenir la liste des réservations
}

// Fonction asynchrone pour récupérer les réservations par ID d'utilisateur
export const fetchBookingsByUserId = async (userId) => {
    return await axios.get(`${BOOKING_API}/${userId}`); // Envoi d'une requête GET pour obtenir les réservations d'un utilisateur spécifique
}

// Fonction asynchrone pour récupérer une réservation par son ID
export const fetchBookingById = async (bookingId) => {
    return await axios.get(`${BOOKING_API}/${bookingId}`); // Envoi d'une requête GET pour obtenir une réservation spécifique
}

// Fonction asynchrone pour ajouter une nouvelle réservation
export const addBooking = async (vehicleId, bookingData) => {
    return await axios.post(`${BOOKING_API}/${vehicleId}`, bookingData); // Envoi d'une requête POST avec les données de la réservation à ajouter
}

// Fonction asynchrone pour modifier une réservation existante
export const editBooking = async (bookingId, bookingData) => {
    return await axios.put(`${BOOKING_API}/${bookingId}`, bookingData); // Envoi d'une requête PUT avec l'ID et les nouvelles données de la réservation
}

// Fonction asynchrone pour supprimer une réservation par son ID
export const deleteBooking = async (bookingId) => {
    return await axios.delete(`${BOOKING_API}/${bookingId}`); // Envoi d'une requête DELETE pour supprimer une réservation
}
