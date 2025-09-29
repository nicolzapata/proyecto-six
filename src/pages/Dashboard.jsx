// src/pages/Dashboard.jsx - DASHBOARD MODIFICADO - VERSION FINAL
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { dashboardAPI, booksAPI, usersAPI, loansAPI, authorsAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    setCurrentTime(new Date()); // Solo establecer la hora inicial
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar datos desde las APIs disponibles
      const [librosData, autoresData] = await Promise.all([
        booksAPI.getAll().catch(() => []), // Fallback si no hay auth
        authorsAPI.getAll().catch(() => [])
      ]);

      // Mapear libros
      const librosArray = Array.isArray(librosData) ? librosData : (librosData.books || []);
      const libros = librosArray.map(libro => ({
        id: libro._id,
        titulo: libro.title,
        autor: libro.author?.name || libro.author,
        disponible: libro.availableCopies > 0,
        genero: libro.genre
      }));

      // Mapear autores
      const autoresArray = Array.isArray(autoresData) ? autoresData : (autoresData.authors || []);
      const autores = autoresArray.map(autor => ({
        id: autor._id,
        nombre: autor.name
      }));

      const librosDisponibles = libros.filter(l => l.disponible).length;

      setStats({
        totalLibros: libros.length,
        librosDisponibles,
        librosPrestados: libros.length - librosDisponibles,
        totalUsuarios: 0, // No disponible sin auth
        usuariosActivos: 0,
        prestamosActivos: 0,
        prestamosVencidos: 0,
        totalEscritores: autores.length,
        generoMasPopular: getGeneroMasPopular(libros),
        autorMasLeido: "N/A" // No disponible sin datos de préstamos
      });

      // Actividad simulada
      setRecentActivity([
        {
          id: 1,
          tipo: "info",
          descripcion: `${libros.length} libros y ${autores.length} autores cargados`,
          tiempo: "Ahora",
          icono: "📊",
          color: "text-blue-500"
        }
      ]);

    } catch (err) {
      setError('Error al cargar los datos del dashboard: ' + err.message);
      console.error('Error loading dashboard data:', err);
      // Set default stats
      setStats({
        totalLibros: 0,
        librosDisponibles: 0,
        librosPrestados: 0,
        totalUsuarios: 0,
        usuariosActivos: 0,
        prestamosActivos: 0,
        prestamosVencidos: 0,
        totalEscritores: 0,
        generoMasPopular: "N/A",
        autorMasLeido: "N/A"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGeneroMasPopular = (libros) => {
    const generos = libros.reduce((acc, libro) => {
      acc[libro.genero] = (acc[libro.genero] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(generos)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";
  };

  const getAutorMasLeido = (libros, prestamos) => {
    const autores = {};
    prestamos.forEach(prestamo => {
      const libro = libros.find(l => l.id === prestamo.libroId);
      if (libro) {
        autores[libro.autor] = (autores[libro.autor] || 0) + 1;
      }
    });
    
    return Object.entries(autores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend, onClick, textAlign = 'center' }) => (
    <div
      className={`card cursor-pointer`}
      onClick={onClick}
    >
      <div className="card-body p-4">
        <div className={`flex items-center ${textAlign === 'left' ? 'justify-start' : textAlign === 'right' ? 'justify-end' : 'justify-between'} mb-4`}>
          <div className={`flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <span className="text-xl">{icon}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <span>{trend > 0 ? '↗️' : '↘️'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`space-y-1 ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}>
          <p className="text-xl font-bold text-primary">{isLoading ? '...' : value}</p>
          <h3 className="font-semibold text-secondary">{title}</h3>
          {subtitle && (
            <p className="text-sm text-tertiary">{subtitle}</p>
          )}
        </div>
        {!isLoading && (
          <div className="mt-4 progress">
            <div
              className="progress-bar"
              style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionButton = ({ icon, title, description, onClick, color }) => (
    <button
      onClick={onClick}
      className={`card hover-scale text-left p-6 group transition-all duration-300 hover:shadow-2xl`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${color} mb-4 group-hover:animate-bounce`}>
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="font-bold text-primary mb-2">{title}</h3>
      <p className="text-sm text-tertiary group-hover:text-secondary transition-colors">
        {description}
      </p>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-secondary mt-4 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container pt-16 pb-8 max-w-7xl mx-auto">
        {/* Header Premium */}
        <div className="card-premium mb-32 mt-8">
          <div className="card-body">
            <div className="flex justify-center items-center">
              {/* Panel usuario centrado */}
              <div className="text-center">
                <div className="mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-gradient mb-2">
                      ¡Bienvenido de vuelta, {user?.username || user?.name || 'Usuario'}! 👋
                    </h1>
                    <p className="text-secondary font-medium">
                      {user?.role === 'admin' ? 'Administrador del Sistema' : 'Bibliotecario'}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2 text-sm text-tertiary">
                       <span>🕒 {currentTime.toLocaleTimeString('es-ES')}</span>
                       e<span>📅 {currentTime.toLocaleDateString('es-ES', {
                         weekday: 'long',
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="card mb-8">
            <div className="alert alert-error">
              {error}
            </div>
          </div>
        )}

        {/* Grid de estadísticas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 mt-8">
          <StatCard
            title="Disponibilidad"
            value={`${stats.totalLibros > 0 ? Math.round((stats.librosDisponibles / stats.totalLibros) * 100) : 0}%`}
            subtitle={`${stats.librosDisponibles} de ${stats.totalLibros} libros`}
            icon="📈"
            color="from-green-400 to-emerald-500"
            trend={5}
            onClick={() => navigate("/libros")}
            textAlign="center"
          />
          <StatCard
            title="Libros Prestados"
            value={stats.librosPrestados}
            subtitle="Actualmente en circulación"
            icon="📖"
            color="from-orange-400 to-red-500"
            trend={-2}
            onClick={() => navigate("/prestamos")}
            textAlign="center"
          />
          <StatCard
            title="Total de Libros"
            value={stats.totalLibros}
            subtitle={`${stats.librosDisponibles} disponibles`}
            icon="📚"
            color="from-emerald-400 to-teal-500"
            trend={12}
            onClick={() => navigate("/libros")}
            textAlign="center"
          />
          <StatCard
            title="Género Popular"
            value={stats.generoMasPopular}
            subtitle="Más solicitado"
            icon="🏷️"
            color="from-blue-400 to-indigo-500"
            trend={10}
            onClick={() => navigate("/libros")}
            textAlign="center"
          />
          <StatCard
            title="Préstamos Activos"
            value={stats.prestamosActivos}
            subtitle={`${stats.prestamosVencidos} vencidos`}
            icon="📋"
            color="from-cyan-400 to-blue-500"
            trend={-3}
            onClick={() => navigate("/prestamos")}
            textAlign="center"
          />
          <StatCard
            title="Tasa de Ocupación"
            value={`${stats.totalLibros > 0 ? Math.round((stats.librosPrestados / stats.totalLibros) * 100) : 0}%`}
            subtitle="Libros en uso"
            icon="📊"
            color="from-purple-400 to-violet-500"
            trend={3}
            onClick={() => navigate("/prestamos")}
            textAlign="center"
          />
          <StatCard
            title="Escritores"
            value={stats.totalEscritores}
            subtitle="Base de datos completa"
            icon="✍️"
            color="from-purple-400 to-pink-500"
            trend={15}
            onClick={() => navigate("/escritores")}
            textAlign="center"
          />
          <StatCard
            title="Usuarios Registrados"
            value={stats.totalUsuarios}
            subtitle={`${stats.usuariosActivos} activos este mes`}
            icon="👥"
            color="from-teal-400 to-cyan-500"
            trend={8}
            onClick={() => navigate("/users")}
            textAlign="center"
          />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;