// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "../styles/components/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <h3>📚 Biblioteca</h3>

      <div className="nav-links">
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
              Panel
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
          </>
        )}
      </div>

      <div className="nav-actions">
        {user && (
          <div className="user-info">
            <span className="text-sm font-medium">
              Bienvenido, <span className="text-accent font-bold">{user.username || user.name || 'Usuario'}</span>
            </span>
          </div>
        )}

        {/* Menú desplegable del perfil */}
        {user && (
          <div className="profile-menu-container" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`profile-button ${location.pathname === "/profile" ? "active" : ""}`}
              title="Perfil"
            >
              {user?.foto ? (
                <img src={user.foto} alt="Foto de perfil" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <span style={{ fontSize: '20px', filter: 'grayscale(1)' }}>👤</span>
              )}
            </button>

          {isMenuOpen && (
            <div className="profile-dropdown">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mi Perfil
              </Link>
              <div className="dropdown-divider"></div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="dropdown-item logout-item"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
          </div>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}