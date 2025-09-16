// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css"; // Importa el archivo CSS

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
      >
        📚 Biblioteca
      </Link>

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
          <Link
            to="/users"
            className={location.pathname === "/users" ? "active" : ""}
          >
            Usuarios
          </Link>
          <Link
            to="/escritores"
            className={location.pathname === "/escritores" ? "active" : ""}
          >
            Escritores
          </Link>

          <Link
            to="/libros"
            className={location.pathname === "/libros" ? "active" : ""}
          >
            Libros
          </Link>
          <Link
            to="/prestamos"
            className={location.pathname === "/prestamos" ? "active" : ""}
          >
            Prestamos
          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium">
              Hola, <span className="text-accent font-semibold">{user.username}</span>
            </span>
            <button 
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Cerrar sesión
            </button>
          </div>

        </>

      )}
      <ThemeToggle />
    </nav>
  );
}