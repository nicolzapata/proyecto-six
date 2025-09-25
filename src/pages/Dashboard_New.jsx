// src/pages/Dashboard_New.jsx - Dashboard Premium con Analytics Avanzados - NUEVA VERSION
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const libros = JSON.parse(localStorage.getItem("libros") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("users") || "[]");
    const prestamos = JSON.parse(localStorage.getItem("prestamos") || "[]");
    const escritores = JSON.parse(localStorage.getItem("escritores") || "[]");

    const librosDisponibles = libros.filter(l => l.disponible).length;
    const prestamosActivos = prestamos.filter(p => p.estado === "activo").length;
    const usuariosActivos = usuarios.filter(u => {
      const lastLogin = new Date(u.lastLogin || u.createdAt);
      const daysSince = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;

    setStats({
      totalLibros: libros.length,
      librosDisponibles,
      librosPrestados: libros.length - librosDisponibles,
      totalUsuarios: usuarios.length,
      usuariosActivos,
      prestamosActivos,
      prestamosVencidos: prestamos.filter(p => {
        if (p.estado !== "activo") return false;
        const diasTranscurridos = Math.ceil((new Date() - new Date(p.fechaPrestamo)) / (1000 * 60 * 60 * 24));
        return diasTranscurridos > 15;
      }).length,
      totalEscritores: escritores.length,
      generoMasPopular: getGeneroMasPopular(libros),
      autorMasLeido: getAutorMasLeido(libros, prestamos)
    });

    setRecentActivity([]);
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="container py-6" style={{ paddingTop: '10px' }}>
        {/* Header Premium */}
        <div className="card-premium mb-24 mt-8 animate-slide-down max-w-4xl mx-auto" style={{ marginTop: '70px' }}>
          <div className="card-body">
            <div className="flex flex-col lg:flex-row justify-center items-start gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="avatar avatar-xl avatar-gradient">
                    {user?.foto ? (
                      <img src={user.foto} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-gradient mb-2 text-center">
                      ¡Bienvenido de vuelta, {user?.username || user?.name || 'Usuario'}!
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="text-center alert alert-success">
                        <p className="text-secondary font-medium mb-2">Rol</p>
                        <p className="text-lg font-semibold text-primary">
                          {user?.role === 'admin' ? 'Administrador del Sistema' : 'Bibliotecario'}
                        </p>
                      </div>
                      <div className="text-center alert alert-info">
                        <div className="card-body space-y-3">
                          <p className="text-secondary font-medium mb-2">Fecha y Hora</p>
                          <div className="text-sm text-tertiary space-y-1">
                            <div>{currentTime.toLocaleTimeString('es-ES')}</div>
                            <div>{currentTime.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-auto lg:text-right">
                <div className="bg-glass rounded-xl p-3 text-sm">
                  <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center mb-3 gap-2 alert alert-success">
                    <div className="card-body space-y-3">
                      <span className="text-tertiary">Estado del sistema:</span>
                        <span className="text-emerald-500 font-semibold">  Activo</span>
                    </div>
                  </div>
                  <div className=" text-tertiary alert alert-info mb-1">
                    <div className="card-body space-y-3">
                      Último acceso: {new Date(user?.lastLogin || user?.createdAt).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de métricas avanzadas */}
        <div className="grid grid-cols-1 gap-10 mb-16">
          <div className="animate-slide-up max-w-5xl mx-auto" style={{ animationDelay: '0.5s' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col sm:flex-row items-start sm:items-center gap-2">
                   Métricas Avanzadas
                  <span className="badge badge-primary">En vivo</span>
                </h2>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                    <h3 className="font-semibold text-secondary">Disponibilidad de Libros</h3>
                    <span className="text-xl sm:text-2xl font-bold text-gradient">
                      {stats.totalLibros} Libros
                    </span>
                  </div>
                  <div className="progress mb-2" style={{ height: '12px' }}>
                    <div
                      className="progress-bar alert alert-success"
                      style={{ width: `${(stats.librosDisponibles / stats.totalLibros) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-tertiary">
                    <span>{stats.librosDisponibles} disponibles</span>
                    <span>{stats.librosPrestados} prestados</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-glass p-4 rounded-xl alert alert-info">
                    <div className="text-sm text-tertiary mb-1">Género más popular</div>
                    <div className="font-bold text-primary">{stats.generoMasPopular}</div>
                  </div>
                  <div className="bg-glass p-4 rounded-xl alert alert-success">
                    <div className="text-sm text-tertiary mb-1">Autor más leído</div>
                    <div className="font-bold text-primary">{stats.autorMasLeido}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de alertas y notificaciones */}
        <div className="mt-16 animate-slide-up max-w-5xl mx-auto" style={{ animationDelay: '0.8s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-base sm:text-lg font-bold flex flex-col sm:flex-row items-start sm:items-center gap-2">
                   Alertas del Sistema
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
                  <div className="alert alert-info">
                    ✅ No hay préstamos vencidos
                  </div>
                )}
                <div className="alert alert-success">
                  💡 Se recomienda hacer backup del sistema
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
