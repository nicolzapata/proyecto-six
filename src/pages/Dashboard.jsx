// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Datos simulados para las estadísticas
  const stats = {
    librosTotal: JSON.parse(localStorage.getItem("libros") || "[]").length,
    usuariosTotal: JSON.parse(localStorage.getItem("users") || "[]").length,
    prestamosActivos: 12, // Simulado
    escritoresTotal: 8 // Simulado
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="animate-fade-in">
          {/* Header de bienvenida */}
          <div className="card mb-8">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    📊 Bienvenido, {user?.username}!
                  </h1>
                  <p className="text-muted">
                    Aquí tienes un resumen de la actividad de la biblioteca
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Último acceso:</p>
                  <p className="text-sm font-medium">
                    {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card animate-slide-up">
              <div className="card-body text-center">
                <div className="text-3xl mb-2">📖</div>
                <div className="text-2xl font-bold text-accent mb-1">{stats.librosTotal}</div>
                <div className="text-sm text-muted">Libros en catálogo</div>
              </div>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-body text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-accent mb-1">{stats.usuariosTotal}</div>
                <div className="text-sm text-muted">Usuarios registrados</div>
              </div>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-body text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-accent mb-1">{stats.prestamosActivos}</div>
                <div className="text-sm text-muted">Préstamos activos</div>
              </div>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-body text-center">
                <div className="text-3xl mb-2">✍️</div>
                <div className="text-2xl font-bold text-accent mb-1">{stats.escritoresTotal}</div>
                <div className="text-sm text-muted">Escritores registrados</div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">🚀 Acciones Rápidas</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate("/libros")}
                    className="btn btn-primary"
                  >
                    + Agregar Libro
                  </button>
                  <button 
                    onClick={() => navigate("/usuarios")}
                    className="btn btn-secondary"
                  >
                    👥 Ver Usuarios
                  </button>
                  <button 
                    onClick={() => navigate("/prestamos")}
                    className="btn btn-secondary"
                  >
                    📋 Gestionar Préstamos
                  </button>
                  <button 
                    onClick={() => navigate("/escritores")}
                    className="btn btn-secondary"
                  >
                    ✍️ Ver Escritores
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">📊 Resumen del Sistema</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Libros disponibles</span>
                    <span className="font-semibold text-success-600">85%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Usuarios activos</span>
                    <span className="font-semibold text-info-600">92%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-info-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Préstamos del mes</span>
                    <span className="font-semibold text-warning-600">67%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-warning-500 h-2 rounded-full" style={{ width: '67%' }}></div>
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

export default Dashboard;
