import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./layout";
import { Card } from './card';
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import { LogIn, Mail, Lock } from "lucide-react";
import { signin } from "../services/authservice";
import '../styles/connexion.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const userCredentials = {
      email: email,
      password: password
    };

    signin(userCredentials)
      .then((result) => {
        if (result.data.success) {
          if (result.data.user.isActive) {
            localStorage.setItem("CC_Token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("refresh_token", result.data.refreshToken);
            
            if (result.data.user.role === "admin") {
              window.location.href = 'http://localhost:3002';
            } else {
              navigate('/menu');
            }
          } else {
            setError("Votre compte n'est pas encore activé");
          }
        } else {
          setError(result.data.message || "Erreur d'authentification");
        }
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Erreur de connexion au serveur");
        console.error("Login error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="login-title">Connexion à votre compte</h1>
          <p className="login-subtitle">
            Ou <Link to="/register">créez un nouveau compte</Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="login-card">
            <div className="login-form-container">
              {error && <div className="error-message">{error}</div>}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="login-input-group">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="login-input-group">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                      className="
                        h-5 w-5 rounded border-2 border-gray-300 
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600
                        transition-colors duration-200
                        appearance-none checked:appearance-auto"
                    />
                    <Label 
                      htmlFor="remember-me" 
                      className="
                        text-sm font-medium text-gray-700
                        hover:text-gray-900 cursor-pointer
                        peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="forgot-password">
                      Mot de passe oublié?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
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
                        Connexion en cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Se connecter
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* ... (rest of your social buttons code remains the same) ... */}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;