// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Importa el archivo CSS

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
    
    // Simular un pequeño delay para la experiencia de usuario
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Buscar usuario por username y contraseña
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    
    if (user) {
      // Iniciar sesión exitosamente
      login(user);
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          
          <div className="additional-links">
            <p>
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
            <p>
              ¿Olvidaste tu contraseña? <Link to="/Forgotpassword">Recupera tu contraseña</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;