an// ===== src/pages/Profile.jsx =====
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, login } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    tipoIdentificacion: user?.tipoIdentificacion || '',
    identificacion: user?.identificacion || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    bio: user?.bio || ''
  });

  const tiposIdentificacion = [
    "Cédula de Ciudadanía",
    "Tarjeta de Identidad",
    "Cédula de Extranjería",
    "Pasaporte",
    "Otro"
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        tipoIdentificacion: user.tipoIdentificacion || '',
        identificacion: user.identificacion || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openEditModal = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      tipoIdentificacion: user?.tipoIdentificacion || '',
      identificacion: user?.identificacion || '',
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      bio: user?.bio || ''
    });
    setError("");
    setSuccess("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener usuarios del localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Encontrar y actualizar el usuario actual
      const updatedUsers = users.map(u =>
        u.id === user.id
          ? { ...u, ...formData }
          : u
      );

      // Guardar en localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Actualizar el contexto de autenticación
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      login(updatedUser);

      setSuccess("¡Perfil actualizado exitosamente!");
      setTimeout(() => {
        closeEditModal();
      }, 2000);

    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError("Error al guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card animate-slide-up">
            <div className="card-body">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">👤 Mi Perfil</h1>
                  <p className="text-muted">Gestiona tu información personal</p>
                </div>
              </div>

              {user ? (
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Nombre de usuario</label>
                      <p className="text-lg font-medium">{user.username}</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Correo electrónico</label>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>

                    {user.nombre && user.apellido && (
                      <div className="form-group">
                        <label className="form-label">Nombre completo</label>
                        <p className="text-lg font-medium">{user.nombre} {user.apellido}</p>
                      </div>
                    )}

                    {user.tipoIdentificacion && user.identificacion && (
                      <div className="form-group">
                        <label className="form-label">Identificación</label>
                        <p className="text-lg font-medium">{user.tipoIdentificacion}: {user.identificacion}</p>
                      </div>
                    )}

                    {user.telefono && (
                      <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <p className="text-lg font-medium">{user.telefono}</p>
                      </div>
                    )}

                    {user.direccion && (
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Dirección</label>
                        <p className="text-lg font-medium">{user.direccion}</p>
                      </div>
                    )}
                  </div>

                  {/* Biografía */}
                  {user.bio && (
                    <div className="form-group">
                      <label className="form-label">Biografía</label>
                      <p className="text-lg">{user.bio}</p>
                    </div>
                  )}

                  {/* Información del sistema */}
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div>
                      <label className="form-label">Fecha de registro</label>
                      <p className="text-sm text-muted">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Rol</label>
                      <p className="text-sm text-muted">{user.role || "Usuario estándar"}</p>
                    </div>
                  </div>

                  {/* Botón de editar */}
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={openEditModal}
                      className="btn btn-primary"
                    >
                      ✏️ Editar Perfil
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">No hay datos del usuario disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Perfil</h3>
              <button onClick={closeEditModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ padding: '2rem' }}>
                {error && (
                  <div className="alert alert-error animate-slide-down mb-6">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success animate-slide-down mb-6">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="edit-username" className="form-label">Nombre de Usuario *</label>
                    <input
                      type="text"
                      id="edit-username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nombre de usuario"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-tipoIdentificacion" className="form-label">Tipo de Identificación</label>
                    <select
                      id="edit-tipoIdentificacion"
                      name="tipoIdentificacion"
                      value={formData.tipoIdentificacion}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposIdentificacion.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-identificacion" className="form-label">Identificación</label>
                    <input
                      type="text"
                      id="edit-identificacion"
                      name="identificacion"
                      value={formData.identificacion}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Número de identificación"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      id="edit-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nombre"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-apellido" className="form-label">Apellido</label>
                    <input
                      type="text"
                      id="edit-apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Apellido"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      id="edit-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Número de teléfono"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="edit-direccion" className="form-label">Dirección</label>
                    <textarea
                      id="edit-direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Dirección completa"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="edit-bio" className="form-label">Biografía</label>
                    <textarea
                      id="edit-bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Cuéntanos sobre ti..."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button type="button" onClick={closeEditModal} className="btn btn-secondary" disabled={isLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}