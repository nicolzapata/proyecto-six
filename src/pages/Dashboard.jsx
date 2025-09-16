// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // 👈 Import del CSS

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>📊 Dashboard</h1>
        <p>
          Bienvenido, <strong>{user?.username}</strong>!
        </p>
        <p>Email: {user?.email}</p>
        <p>Te registraste el: {new Date(user?.createdAt).toLocaleDateString()}</p>

        <div className="dashboard-options">
          <h2>Opciones</h2>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
