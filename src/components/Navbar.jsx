// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="navbar">


      <h3>📚 Biblioteca</h3>  

      <Link 
        to="/" 
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
      >
        Inicio
      </Link>
      {!user ? (
        <Link 
          to="/login"
          className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
        >
          Iniciar sesión
        </Link>
      ) : (
        <>
          <Link 
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/profile"
            className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
          >
            Perfil
          </Link>
          <Link
            to="/users"
            className={`nav-link ${location.pathname === "/users" ? "active" : ""}`}
          >
            Usuarios
          </Link>
          <Link
            to="/escritores"
            className={`nav-link ${location.pathname === "/escritores" ? "active" : ""}`}
          >
            Escritores
          </Link>

          <Link
            to="/libros"
            className={`nav-link ${location.pathname === "/libros" ? "active" : ""}`}
          >
            Libros
          </Link>
          <Link
            to="/prestamos"
            className={`nav-link ${location.pathname === "/prestamos" ? "active" : ""}`}
          >
            Prestamos
          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium">
              Hola, <span className="text-accent font-bold">{user.username}</span>
            </span>
            <button 
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.80rem' }}
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