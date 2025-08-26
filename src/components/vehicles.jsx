// src/pages/Vehicles.jsx
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Vehicles.css';
import Layout from './layout';

export default function Vehicles() {
  const [vehicles, setVehicles]   = useState([]);
  const [loading, setLoading]     = useState(true);

  // états des filtres
  const [brand,  setBrand]  = useState('');
  const [model,  setModel]  = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const navigate = useNavigate();

  /* ---------- récupération des données ---------- */
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get('/vehicles');
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  /* ---------- filtrage (mémoïsé) ---------- */
  const filtered = useMemo(() => {
    return vehicles.filter(v =>
      v.brand.toLowerCase().includes(brand.toLowerCase()) &&
      v.model.toLowerCase().includes(model.toLowerCase()) &&
      v.price_per_day >= minPrice &&
      v.price_per_day <= maxPrice
    );
  }, [vehicles, brand, model, minPrice, maxPrice]);

  if (loading) return <p className="loading">Chargement…</p>;

  return (
    <Layout>
        <br /><br /><br /><br />
    <div className="vehicles-wrapper">
      <h1 className="page-title">Nos véhicules</h1>

      {/* ===== Barre de filtres ===== */}
      <form className="filter-bar" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Marque"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Modèle"
          value={model}
          onChange={e => setModel(e.target.value)}
        />
        <div className="price-range">
          <label>
            Prix min&nbsp;
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={minPrice}
              onChange={e => setMinPrice(Number(e.target.value))}
            />
            <span>{minPrice} €</span>
          </label>

          <label>
            Prix max&nbsp;
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
            <span>{maxPrice} €</span>
          </label>
        </div>
      </form>

      {/* ===== Grille de cards ===== */}
      {filtered.length === 0 ? (
        <p className="empty-msg">Aucun véhicule ne correspond aux critères.</p>
      ) : (
        <div className="vehicles-grid">
          {filtered.map(v => (
            <div key={v._id} className="vehicle-card">
              <div
                className={`badge ${v.available ? 'available' : 'unavailable'}`}
              >
                {v.available ? 'Disponible' : 'Indisponible'}
              </div>

              <img
                className="vehicle-img"
                src={v.image || '/img/placeholder.jpg'}
                alt={`${v.brand} ${v.model}`}
              />

              <div className="vehicle-info">
                <h3 className="vehicle-title">
                  {v.brand} <span>{v.model}</span>
                </h3>
                <p className="vehicle-details">
                  {v.year} · {v.type} · {v.transmission}
                </p>
                <p className="vehicle-price">{v.price_per_day} € / jour</p>

                <button
                  className="btn-reserve"
                  onClick={() => navigate(`/?vehicle=${v._id}`)}
                  disabled={!v.available}
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </Layout>
  );
}