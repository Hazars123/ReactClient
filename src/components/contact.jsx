// src/pages/Contact.jsx
import React, { useState } from 'react';
import Layout from './layout';

const contact = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Message envoyé avec succès');
        setForm({ firstname: '', lastname: '', email: '', message: '' });
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Erreur serveur');
    }
  };

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

        <div
          className="hero inner-page"
          style={{ backgroundImage: 'url("./src/assets/Template/assets/images/hero_1_a.jpg")' }}
        >
          <div className="container">
            <div className="row align-items-end">
              <div className="col-lg-5">
                <div className="intro">
                  <h1><strong>Contact</strong></h1>
                  <div className="custom-breadcrumbs">
                    <a href="/">Home</a> <span className="mx-2">/</span> <strong>Contact</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-section bg-light" id="contact-section">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-7 text-center mb-5">
                <h2>Contactez-nous</h2>
                <p>Nous sommes là pour vous aider. Envoyez-nous un message !</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 mb-5">
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-md-6 mb-4 mb-lg-0">
                      <input
                        type="text"
                        name="firstname"
                        className="form-control"
                        placeholder="Prénom"
                        value={form.firstname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="lastname"
                        className="form-control"
                        placeholder="Nom"
                        value={form.lastname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Adresse e-mail"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                      <textarea
                        name="message"
                        className="form-control"
                        placeholder="Votre message"
                        rows={10}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6 mr-auto">
                      <button type="submit" className="btn btn-primary">
                        Envoyer
                      </button>
                    </div>
                  </div>

                  {status && <p className="mt-3">{status}</p>}
                </form>
              </div>

              <div className="col-lg-4 ml-auto">
                <div className="bg-white p-3 p-md-5">
                  <h3 className="text-black mb-4">Infos contact</h3>
                  <ul className="list-unstyled footer-link">
                    <li className="d-block mb-3">
                      <span className="d-block text-black">Adresse :</span>
                      <span>123 Rue Exemple, Tunis, Tunisie</span>
                    </li>
                    <li className="d-block mb-3">
                      <span className="d-block text-black">Téléphone :</span>
                      <span>+216 12 345 678</span>
                    </li>
                    <li className="d-block mb-3">
                      <span className="d-block text-black">Email :</span>
                      <span>isimg@example.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default contact;