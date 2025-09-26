// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import "../styles/components/login-register.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-page">
      <div className="container">
        <div className="auth-layout">
          {/* Carrusel de imágenes con banner */}
          <div className="auth-carousel">
            <Carousel />
            {/* Banner informativo con imagen splash */}
            <div className="info-banner-container">
              <div className="info-banner">
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=120&fit=crop"
                  alt="Biblioteca moderna"
                  className="banner-bg"
                />
                <div className="banner-content">
                  <h4>Miles de libros te esperan</h4>
                  <p>Únete a nuestra comunidad de lectores</p>
                </div>
              </div>
            </div>

            {/* Segundo banner */}
            <div className="info-banner-container">
              <div className="info-banner">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=120&fit=crop"
                  alt="Lectura"
                  className="banner-bg"
                />
                <div className="banner-content">
                  <h4>Descubre nuevos mundos</h4>
                  <p>Explora géneros infinitos</p>
                </div>
              </div>
            </div>

            {/* Tercer banner */}
            <div className="info-banner-container">
              <div className="info-banner">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=120&fit=crop"
                  alt="Comunidad"
                  className="banner-bg"
                />
                <div className="banner-content">
                  <h4>Comparte y conecta</h4>
                  <p>Con lectores apasionados como tú</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de login */}
          <div className="auth-form-section">
            <div className="auth-form">
              <div className="card w-full max-w-md">
                <div className="card-body">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      📚 Bienvenido a la Biblioteca
                    </h1>
                    <p className="text-muted">Inicia sesión para continuar</p>
                  </div>

                  {error && (
                    <div className="alert alert-error animate-slide-down">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Nombre de usuario
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <div className="password-input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Ingresa tu contraseña"
                          className="form-input"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? (
                            <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar sesión"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted mb-2">
                      ¿No tienes cuenta?{" "}
                      <Link to="/register" className="text-accent font-medium hover:underline">
                        Regístrate aquí
                      </Link>
                    </p>
                    <p className="text-sm text-muted">
                      ¿Olvidaste tu contraseña?{" "}
                      <Link to="/forgotpassword" className="text-accent font-medium hover:underline">
                        Recupérala aquí
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;