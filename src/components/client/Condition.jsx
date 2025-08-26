import React from 'react';
import './Condition.css';

const Condition = () => {
  return (
    <div className="condition-container">
      <header className="condition-header">
        <h1>Conditions Générales de Location</h1>
        <p className="last-update">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
      </header>

      <div className="condition-content">
        <section className="condition-section">
          <h2><span className="section-number">1.</span> Éligibilité et Réservation</h2>
          <ul>
            <li>Le locataire doit être âgé d'au moins 21 ans et posséder un permis de conduire valide depuis au moins 2 ans.</li>
            <li>Une pièce d'identité et un justificatif de domicile de moins de 3 mois sont requis.</li>
            <li>La réservation devient ferme après versement d'un acompte de 30% du montant total.</li>
          </ul>
        </section>

        <section className="condition-section">
          <h2><span className="section-number">2.</span> Tarifs et Paiement</h2>
          <ul>
            <li>Les tarifs incluent le kilométrage illimité et l'assurance responsabilité civile.</li>
            <li>Des options supplémentaires (GPS, siège bébé) sont disponibles avec supplément.</li>
            <li>Le solde doit être réglé au plus tard au moment de la prise en charge du véhicule.</li>
          </ul>
        </section>

        <section className="condition-section">
          <h2><span className="section-number">3.</span> Assurance et Responsabilité</h2>
          <ul>
            <li>Tous nos véhicules sont assurés tous risques avec une franchise réduisible.</li>
            <li>Le locataire est responsable des dommages causés par une utilisation inappropriée.</li>
            <li>Les dégâts intérieurs (taches, brûlures) ne sont pas couverts par l'assurance.</li>
          </ul>
        </section>

        <section className="condition-section">
          <h2><span className="section-number">4.</span> Utilisation du Véhicule</h2>
          <ul>
            <li>Interdiction formelle de sous-louer le véhicule ou de l'utiliser pour des compétitions.</li>
            <li>Le véhicule ne doit pas quitter le territoire national sans autorisation préalable.</li>
            <li>Le carburant est à la charge du locataire (rendu avec le même niveau).</li>
          </ul>
        </section>

        <section className="condition-section">
          <h2><span className="section-number">5.</span> Retour et Contrôle</h2>
          <ul>
            <li>Le véhicule doit être rendu à la date et heure convenues sous peine de majoration.</li>
            <li>Un état des lieux contradictoire sera effectué au retour.</li>
            <li>La caution sera restituée dans les 7 jours ouvrés après vérification.</li>
          </ul>
        </section>

        <div className="acceptance-section">
          <div className="checkbox-container">
            <input type="checkbox" id="acceptConditions" />
            <label htmlFor="acceptConditions">J'ai lu et j'accepte les conditions générales de location</label>
          </div>
          <button className="accept-button">Confirmer et continuer</button>
        </div>
      </div>
    </div>
  );
};

export default Condition;