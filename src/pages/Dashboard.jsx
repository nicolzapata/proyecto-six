// src/pages/Dashboard.jsx - Dashboard Premium con Analytics Avanzados
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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const StatCard = ({ title, value, subtitle, icon, color, trend, onClick, delay = 0 }) => (
    <div 
      className={`card hover-lift hover-glow cursor-pointer animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <span className="text-2xl">{icon}</span>
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
        <div className="space-y-1">
          <p className="text-2xl font-bold text-primary">{isLoading ? '...' : value}</p>
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
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Header Premium */}
        <div className="card-premium mb-8 animate-slide-down">
          <div className="card-body">
            <div className="flex justify-between items-start">
              {/* Panel usuario (eliminado gestión de usuario) */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar avatar-xl avatar-gradient">
                    {user?.foto ? (
                      <img src={user.foto} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gradient mb-2">
                      ¡Bienvenido de vuelta, {user?.username || user?.name || 'Usuario'}! 👋
                    </h1>
                    <p className="text-secondary font-medium">
                      {user?.role === 'admin' ? '👑 Administrador del Sistema' : '📚 Bibliotecario'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-tertiary">
                      <span>🕒 {currentTime.toLocaleTimeString('es-ES')}</span>
                      <span>📅 {currentTime.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
                {/* Métricas rápidas */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-glass rounded-xl">
                    <div className="text-lg font-bold text-emerald-500">{stats.prestamosActivos}</div>
                    <div className="text-xs text-tertiary">Préstamos hoy</div>
                  </div>
                  <div className="text-center p-3 bg-glass rounded-xl">
                    <div className="text-lg font-bold text-teal-500">{stats.usuariosActivos}</div>
                    <div className="text-xs text-tertiary">Usuarios activos</div>
                  </div>
                  <div className="text-center p-3 bg-glass rounded-xl">
                    <div className="text-lg font-bold text-cyan-500">{((stats.librosDisponibles / stats.totalLibros) * 100).toFixed(0)}%</div>
                    <div className="text-xs text-tertiary">Disponibilidad</div>
                  </div>
                </div>
              </div>
              {/* Panel de control rápido y resto del dashboard restaurado */}
              <div className="text-right">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => navigate("/profile")}
                    className="btn btn-ghost tooltip"
                    data-tooltip="Ver perfil"
                  >
                    👤
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger tooltip"
                    data-tooltip="Cerrar sesión"
                  >
                    🚪
                  </button>
                </div>
                {/* Estado del sistema */}
                <div className="bg-glass rounded-xl p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-tertiary">Estado del sistema</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-500 font-semibold">Activo</span>
                    </div>
                  </div>
                  <div className="text-xs text-tertiary">
                    Último backup: hace 2 horas
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Libros"
            value={stats.totalLibros}
            subtitle={`${stats.librosDisponibles} disponibles`}
            icon="📚"
            color="from-emerald-400 to-teal-500"
            trend={12}
            onClick={() => navigate("/libros")}
            delay={0.1}
          />
          <StatCard
            title="Usuarios Registrados"
            value={stats.totalUsuarios}
            subtitle={`${stats.usuariosActivos} activos este mes`}
            icon="👥"
            color="from-teal-400 to-cyan-500"
            trend={8}
            onClick={() => navigate("/users")}
            delay={0.2}
          />
          <StatCard
            title="Préstamos Activos"
            value={stats.prestamosActivos}
            subtitle={`${stats.prestamosVencidos} vencidos`}
            icon="📋"
            color="from-cyan-400 to-blue-500"
            trend={-3}
            onClick={() => navigate("/prestamos")}
            delay={0.3}
          />
          <StatCard
            title="Escritores"
            value={stats.totalEscritores}
            subtitle="Base de datos completa"
            icon="✍️"
            color="from-purple-400 to-pink-500"
            trend={15}
            onClick={() => navigate("/escritores")}
            delay={0.4}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Panel de métricas avanzadas */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="card-header">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  📊 Métricas Avanzadas
                  <span className="badge badge-primary">En vivo</span>
                </h2>
              </div>
              <div className="card-body space-y-6">
                {/* Gráfico de disponibilidad */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-secondary">Disponibilidad de Libros</h3>
                    <span className="text-2xl font-bold text-gradient">
                      {((stats.librosDisponibles / stats.totalLibros) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress mb-2" style={{ height: '12px' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${(stats.librosDisponibles / stats.totalLibros) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-tertiary">
                    <span>{stats.librosDisponibles} disponibles</span>
                    <span>{stats.librosPrestados} prestados</span>
                  </div>
                </div>
                {/* Métricas adicionales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-glass p-4 rounded-xl">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-sm text-tertiary mb-1">Género más popular</div>
                    <div className="font-bold text-primary">{stats.generoMasPopular}</div>
                  </div>
                  <div className="bg-glass p-4 rounded-xl">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-sm text-tertiary mb-1">Autor más leído</div>
                    <div className="font-bold text-primary">{stats.autorMasLeido}</div>
                  </div>
                </div>
                {/* Indicadores de rendimiento */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Eficiencia del sistema</span>
                    <span className="text-sm font-bold text-emerald-500">98.5%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: '98.5%' }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Satisfacción de usuarios</span>
                    <span className="text-sm font-bold text-teal-500">94.2%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Actividad reciente */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🔔 Actividad Reciente
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </h2>
              </div>
              <div className="card-body p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 hover:bg-glass transition-colors border-b border-glass last:border-b-0"
                    >
                      <div className={`text-xl ${activity.color} animate-bounce`} style={{ animationDelay: `${index * 0.2}s` }}>
                        {activity.icono}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary mb-1">
                          {activity.descripcion}
                        </p>
                        <p className="text-xs text-tertiary">{activity.tiempo}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-glass">
                  <button className="btn btn-ghost w-full text-sm">
                    Ver todo el historial →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Acciones rápidas */}
        <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
            🚀 Acciones Rápidas
            <span className="text-sm font-normal text-tertiary">¿Qué quieres hacer hoy?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon="📚"
              title="Agregar Libro"
              description="Añade un nuevo libro al catálogo"
              onClick={() => navigate("/libros")}
              color="bg-gradient-to-br from-emerald-400 to-teal-500"
            />
            <QuickActionButton
              icon="📋"
              title="Nuevo Préstamo"
              description="Registra un préstamo de libro"
              onClick={() => navigate("/prestamos")}
              color="bg-gradient-to-br from-teal-400 to-cyan-500"
            />
            <QuickActionButton
              icon="👤"
              title="Registrar Usuario"
              description="Agrega un nuevo usuario al sistema"
              onClick={() => navigate("/users")}
              color="bg-gradient-to-br from-cyan-400 to-blue-500"
            />
            <QuickActionButton
              icon="✍️"
              title="Añadir Escritor"
              description="Registra un nuevo autor"
              onClick={() => navigate("/escritores")}
              color="bg-gradient-to-br from-purple-400 to-pink-500"
            />
          </div>
        </div>
        {/* Panel de alertas y notificaciones */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alertas */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  ⚠️ Alertas del Sistema
                  {stats.prestamosVencidos > 0 && (
                    <span className="badge badge-error">{stats.prestamosVencidos}</span>
                  )}
                </h3>
              </div>
              <div className="card-body space-y-3">
                {stats.prestamosVencidos > 0 ? (
                  <div className="alert alert-warning">
                    <strong>{stats.prestamosVencidos}</strong> préstamo(s) vencido(s) requieren atención
                  </div>
                ) : (
                  <div className="alert alert-success">
                    ✅ No hay préstamos vencidos
                  </div>
                )}
                <div className="alert alert-info">
                  💡 Se recomienda hacer backup del sistema
                </div>
              </div>
            </div>
            {/* Estadísticas rápidas */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  📈 Resumen Semanal
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Nuevos préstamos</span>
                    <span className="font-bold text-emerald-500">+{stats.prestamosActivos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Libros devueltos</span>
                    <span className="font-bold text-teal-500">+12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Nuevos usuarios</span>
                    <span className="font-bold text-cyan-500">+3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Tasa de ocupación</span>
                    <span className="font-bold text-purple-500">{((stats.librosPrestados / stats.totalLibros) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;