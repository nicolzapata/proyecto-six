// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>👤 Perfil del Usuario</h1>
        {user ? (
          <div className="profile-info">
            <p><strong>Nombre de usuario:</strong> {user.username}</p>
            <p><strong>Fecha de registro:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>Último inicio de sesión:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "No disponible"}</p>
            <p><strong>Rol:</strong> {user.role || "Usuario estándar"}</p>
          </div>
        ) : (
          <p>No hay datos del usuario</p>
        )}
      </div>
    </div>
  );
}
