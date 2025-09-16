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
          <Link
            to="/libros"
            className={location.pathname === "/libros" ? "active" : ""}
          >
            Libros
          </Link>
          <Link
            to="/escritores"
            className={location.pathname === "/escritores" ? "active" : ""}
          >
            Escritores
          </Link>
          <Link
            to="/prestamos"
            className={location.pathname === "/prestamos" ? "active" : ""}
          >
            Prestamos
          </Link>
          <Link
            to="/users"
            className={location.pathname === "/users" ? "active" : ""}
          >
            Usuarios
          </Link>

          <span>{user.name}</span>
          <button onClick={logout}>Cerrar sesión</button>

        </>

      )}
    </nav>
  );
}