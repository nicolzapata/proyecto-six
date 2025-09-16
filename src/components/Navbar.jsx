// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Importa el archivo CSS

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className={location.pathname === "/" ? "active" : ""}
      >
        Inicio
      </Link>
      {!user ? (
        <Link 
          to="/login"
          className={location.pathname === "/login" ? "active" : ""}
        >
          Iniciar sesión
        </Link>
      ) : (
        <>
          <Link 
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link 
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
          >
            Perfil
          </Link>
          <span>{user.name}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}