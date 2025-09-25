// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "../components/Carousel";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          {/* Carrusel de imágenes */}
          <div className="auth-carousel">
            <Carousel />
          </div>

          {/* Formulario de login */}
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
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className="form-input"
                      disabled={isLoading}
                    />
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
  );
};

export default Login;