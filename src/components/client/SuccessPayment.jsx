import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SuccessPayment.css';

const SuccessPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Confirmer le paiement et récupérer les détails en parallèle
        const [confirmResponse, bookingResponse] = await Promise.all([
          axios.patch(`/payment/${bookingId}/confirm-payment`, {}, { headers }),
          axios.get(`/bookings/${bookingId}`, { headers })
        ]);

        setBookingDetails(bookingResponse.data);
        
        // Générer la signature après que les données soient chargées
        setTimeout(() => {
          generateSignature(bookingResponse.data.firstname);
        }, 100);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const generateSignature = (name) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext('2d');
    
    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configuration du style
    ctx.font = '20px cursive';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Dessiner le nom
    const text = name;
    const textWidth = ctx.measureText(text).width;
    const x = 10;
    const y = canvas.height / 2;
    
    ctx.fillText(text, x, y);
    
    // Ajouter une ligne décorative sous la signature
    ctx.beginPath();
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x + textWidth, y + 15);
    ctx.stroke();
    
    // Ajouter quelques traits décoratifs pour simuler une signature manuscrite
    ctx.beginPath();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    
    // Trait décoratif 1
    ctx.moveTo(x + textWidth + 5, y - 5);
    ctx.quadraticCurveTo(x + textWidth + 15, y - 10, x + textWidth + 25, y);
    
    // Trait décoratif 2
    ctx.moveTo(x + textWidth + 10, y + 5);
    ctx.quadraticCurveTo(x + textWidth + 20, y + 10, x + textWidth + 30, y + 5);
    
    ctx.stroke();
  };

  const printContract = () => {
    if (!bookingDetails) return;

    const printWindow = window.open('', '_blank');
    const contractHTML = `
      <html>
        <head>
          <title>Contrat de Location</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 20px; 
            }
            .contract-container { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .contract-header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .contract-title { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 10px;
            }
            .section { 
              margin-bottom: 20px; 
              page-break-inside: avoid;
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              border-bottom: 1px solid #000; 
              margin-bottom: 10px; 
              padding-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            .signature-area { 
              margin-top: 50px; 
              display: flex; 
              justify-content: space-between; 
              page-break-inside: avoid;
            }
            .signature-box { 
              width: 200px; 
              border-top: 1px solid #000; 
              margin-top: 40px; 
              text-align: center; 
              padding-top: 5px;
            }
            .conditions {
              font-size: 12px;
              line-height: 1.4;
            }
            @media print {
              body { margin: 0; }
              .contract-container { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="contract-container">
            <div class="contract-header">
              <div class="contract-title">CONTRAT DE LOCATION DE VÉHICULE</div>
              <div>N° ${bookingId}</div>
              <div>Date: ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMATIONS CLIENT</div>
              <div class="info-grid">
                <div><strong>Nom:</strong> ${bookingDetails.lastname || ''}</div>
                <div><strong>Prénom:</strong> ${bookingDetails.firstname || ''}</div>
                <div><strong>Téléphone:</strong> ${bookingDetails.phone || ''}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DÉTAILS DU VÉHICULE</div>
              <div class="info-grid">
                <div><strong>Marque:</strong> ${bookingDetails.brand || ''}</div>
                <div><strong>Modèle:</strong> ${bookingDetails.model || ''}</div>
                <div><strong>Année:</strong> ${bookingDetails.year || ''}</div>
                <div><strong>Immatriculation:</strong> ${bookingDetails.license_plate || 'N/A'}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DÉTAILS DE LA LOCATION</div>
              <div class="info-grid">
                <div><strong>Date de début:</strong> ${new Date(bookingDetails.start_date).toLocaleDateString('fr-FR')}</div>
                <div><strong>Date de fin:</strong> ${new Date(bookingDetails.end_date).toLocaleDateString('fr-FR')}</div>
                <div><strong>Lieu de prise en charge:</strong> ${bookingDetails.lieuLocation || ''}</div>
                <div><strong>Prix total:</strong> ${bookingDetails.total_price || ''} €</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">CONDITIONS GÉNÉRALES</div>
              <div class="conditions">
                <p><strong>1. État du véhicule:</strong> Le véhicule doit être retourné dans le même état qu'au départ, propre et avec le même niveau de carburant.</p>
                <p><strong>2. Responsabilité:</strong> Tout dommage, vol ou accident sera facturé au client selon les tarifs en vigueur.</p>
                <p><strong>3. Retard:</strong> Les retards entraîneront des frais supplémentaires de 10€ par heure commencée.</p>
                <p><strong>4. Carburant:</strong> Le carburant est à la charge du client. Le véhicule doit être rendu avec le même niveau.</p>
                <p><strong>5. Assurance:</strong> Le client déclare être couvert par une assurance valide pour la conduite du véhicule loué.</p>
                <p><strong>6. Utilisation:</strong> Le véhicule ne peut être utilisé que sur le territoire français et par le conducteur déclaré.</p>
              </div>
            </div>
            
            <div class="signature-area">
              <div>
                <div><strong>Signature du client:</strong></div>
                <div><em>${bookingDetails.firstname} ${bookingDetails.lastname}</em></div>
                <div class="signature-box">Date et signature</div>
              </div>
              <div>
                <div><strong>Signature du représentant:</strong></div>
                <div><em>Location Services</em></div>
                <div class="signature-box">Date et signature</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(contractHTML);
    printWindow.document.close();
    printWindow.focus();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  if (isLoading) {
    return (
      <div className="success-payment">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des détails de votre réservation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-payment">
      <div className="success-animation">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">           <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>           <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>         </svg>
      </div>
      
      <div className="success-content">
        <h1 className="success-title">Paiement Réussi!</h1>
        <p className="success-message">
          Votre réservation a été confirmée. Un email de confirmation vous a été envoyé.
        </p>
        
        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Numéro de réservation:</span>
            <span className="detail-value">{bookingId || 'Non disponible'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Statut:</span>
            <span className="detail-value status-confirmed">Confirmée</span>
          </div>
        </div>

        {bookingDetails && (
          <div className="contract-section">
            <h3>Votre contrat de location</h3>
            <div className="contract-preview">
              <div className="contract-info">
                <p><strong>Client:</strong> {bookingDetails.firstname} {bookingDetails.lastname}</p>
                <p><strong>Véhicule:</strong> {bookingDetails.brand} {bookingDetails.model} ({bookingDetails.year})</p>
                <p><strong>Période:</strong> {new Date(bookingDetails.start_date).toLocaleDateString('fr-FR')} au {new Date(bookingDetails.end_date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Prix total:</strong> {bookingDetails.total_price} €</p>
              </div>
              
              <div className="signature-preview">
                <p><strong>Signature générée:</strong></p>
                <canvas 
                  ref={signatureCanvasRef} 
                  width="250" 
                  height="80"
                  className="signature-canvas"
                />
              </div>
            </div>
            
            <button 
              onClick={printContract}
              className="btn btn-contract"
              disabled={!bookingDetails}
            >
              📄 Imprimer le contrat
            </button>
          </div>
        )}
        
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/reservation')}
            className="btn btn-primary"
          >
            📋 Voir mes réservations
          </button>
          <button 
            onClick={() => navigate('/menu')}
            className="btn btn-secondary"
          >
            🚗 Louer un autre véhicule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;

