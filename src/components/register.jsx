import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import Layout from "./layout";
import { Card } from './card';
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import {signup} from '../services/authservice';
import '../styles/inscription.css';

const Register = () => {

  const [formData, setFormData] = useState({

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    password: "",

    confirmPassword: ""

  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleChange = e => {

    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

  };


  const handleSubmit = async e => {

    e.preventDefault();

    setError("");


    if (formData.password !== formData.confirmPassword) {

      setError("Les mots de passe ne correspondent pas.");

      return;

    }


    if (!acceptTerms) {

      setError("Vous devez accepter les conditions générales pour créer un compte.");

      return;

    }


    setIsLoading(true);


    const userData = {

      firstname: formData.firstName,

      lastname: formData.lastName,

      email: formData.email,

      phone: formData.phone,

      password: formData.password,

      confirmPassword: formData.confirmPassword

    };


    try {

      const res = await signup(userData);

      if (res.data.success) {

        navigate('/login');

      } else {

        setError(res.data.message || "Erreur lors de l'inscription");

      }

    } catch (err) {

      setError(err.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");

    } finally {

      setIsLoading(false);

    }

  };

  return (
    <Layout>
   <div className="register-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="register-title">Créer un compte</h1>
        <p className="register-subtitle">
          Ou <Link to="/login" className="register-subtitle-link">connectez-vous à votre compte existant</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="register-card">
          <div className="register-form-container">
            {error && <div className="error-message">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="register-grid">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="register-input-group">
                   
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Jean"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <div className="register-input-group">
                  
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Dupont"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Adresse email</Label>
                <div className="register-input-group">
                 
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="register-input"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <div className="register-input-group">
                 
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="register-input"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="register-input-group">
               
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="register-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="register-input-group">
                
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="register-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="terms-checkbox-group flex items-center space-x-2">

  <Checkbox

    id="accept-terms"

    checked={acceptTerms}

    onCheckedChange={checked => setAcceptTerms(checked)}

  />

  <Label htmlFor="accept-terms" className="terms-checkbox-label text-sm">

    J'accepte les <Link to="/terms" className="text-blue-600 hover:underline">conditions générales</Link> et la{' '}

    <Link to="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link>

  </Label>

</div>

              <div>
                <Button
                  type="submit"
                  className="register-button"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="loading-spinner"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Inscription en cours...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      S'inscrire
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="register-divider">
              <div className="register-divider-line">
                <div></div>
              </div>
              <div className="register-divider-text">
                <span>Ou s'inscrire avec</span>
              </div>
            </div>

            <div className="social-buttons">
              <Button variant="outline" type="button" className="social-button">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                Google
              </Button>

              <Button variant="outline" type="button" className="social-button">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </Layout>
  )
}

export default Register

