import React from 'react';
import { useLocation } from 'react-router-dom';

const CancelPayment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');

  return (
    <div>
      <h1>Paiement annulé</h1>
      <p>Votre paiement a été annulé. Veuillez réessayer.</p>
      <p>Numéro de réservation : {bookingId}</p>
    </div>
  );
};

export default CancelPayment;
