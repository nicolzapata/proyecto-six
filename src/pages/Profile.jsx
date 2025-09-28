// ===== src/pages/Profile.jsx =====
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import {
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validateTelefono
} from "../utils/validators";

export default function Profile() {
  const { user, login } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || user?.name || '',
    email: user?.email || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    foto: user?.foto || ''
  });


  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || user.name || '',
        email: user.email || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        foto: user.foto || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};

    // Validar username
    const usernameMin = validateMinLength(formData.username, 3, "Nombre de usuario");
    if (!usernameMin.isValid) errors.username = usernameMin.error;

    const usernameMax = validateMaxLength(formData.username, 50, "Nombre de usuario");
    if (!usernameMax.isValid) errors.username = usernameMax.error;

    // Validar email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;

    // Validar nombre
    if (formData.nombre) {
      const nombreMax = validateMaxLength(formData.nombre, 100, "Nombre");
      if (!nombreMax.isValid) errors.nombre = nombreMax.error;
    }

    // Validar apellido
    if (formData.apellido) {
      const apellidoMax = validateMaxLength(formData.apellido, 100, "Apellido");
      if (!apellidoMax.isValid) errors.apellido = apellidoMax.error;
    }

    // Validar teléfono
    if (formData.telefono) {
      const telefonoValidation = validateTelefono(formData.telefono);
      if (!telefonoValidation.isValid) errors.telefono = telefonoValidation.error;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setHasChanges(true);

    // Limpiar error del campo
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({
        ...prev,
        [e.target.name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          foto: e.target.result
        });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = () => {
    setFormData({
      username: user?.username || user?.name || '',
      email: user?.email || '',
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      foto: user?.foto || ''
    });
    setError("");
    setSuccess("");
    setHasChanges(false);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (hasChanges) {
      if (!window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sin guardar?")) {
        return;
      }
    }
    setShowEditModal(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await usersAPI.update(user.id, formData);
      console.log('Perfil actualizado:', response);

      // Actualizar el contexto de autenticación
      login(response.user || response);

      setSuccess("¡Perfil actualizado exitosamente!");
      setHasChanges(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="card animate-slide-up">
            <div className="card-body">
              <div className="flex items-center text-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                  {user?.foto ? (
                    <img src={user.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || '👤'
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2 text-center">👤 Mi Perfil</h1>
                  <p className="text-muted">Gestiona tu información personal</p>
                </div>
              </div>

              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Información de Cuenta */}
                  <div key="account-info">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Información de Cuenta</h3>

                      <div className="gap-6 alert justify-between ">
                        <div key="username">
                          <strong className="text-gray-600 text-sm uppercase tracking-wide block mb-1">Nombre de usuario</strong>
                          <div className="text-lg text-gray-900">{user?.username || user?.name || ''}</div>
                        </div>
                        <div key="email">
                          <strong className="text-gray-600 text-sm uppercase tracking-wide block mb-1">Correo electrónico</strong>
                          <div className="text-lg text-gray-900">{user?.email || ''}</div>
                        </div>
                      </div>
                  </div>

                  {/* Información del Sistema */}
                  <div key="system-info">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Información del Sistema</h3>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow-lg border p-6">
                      <div className="grid grid-cols-2 gap-6 alert">
                        <div key="registration-date">
                          <strong className="text-gray-600 text-sm uppercase tracking-wide block mb-1">Fecha de registro</strong>
                          <div className="text-lg text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : ''}
                          </div>
                        </div>
                        <div key="role">
                          <strong className="text-gray-600 text-sm uppercase tracking-wide block mb-1">Rol</strong>
                          <div className="text-lg text-gray-900">{user?.role || "Usuario estándar"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de editar */}
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={openEditModal}
                      className="btn btn-primary"
                    >
                       Editar Perfil
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
              <div className="modal-body p-20">
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

                {hasChanges && (
                  <div className="alert alert-warning animate-slide-down mb-6">
                    ⚠️ Tienes cambios sin guardar. Recuerda guardar antes de cerrar.
                  </div>
                )}

                <div className="flex flex-col gap-12">
                  <div className="form-group">
                    <label htmlFor="edit-username" className="form-label">Nombre de Usuario *</label>
                    <input
                      type="text"
                      id="edit-username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.username ? 'border-error' : ''}`}
                      placeholder="Nombre de usuario"
                      disabled={isLoading}
                    />
                    {formErrors.username && (
                      <div className="text-error text-sm mt-1">{formErrors.username}</div>
                    )}
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
                      className={`form-input ${formErrors.email ? 'border-error' : ''}`}
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                    />
                    {formErrors.email && (
                      <div className="text-error text-sm mt-1">{formErrors.email}</div>
                    )}
                  </div>


                  <div className="form-group">
                    <label htmlFor="edit-nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      id="edit-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.nombre ? 'border-error' : ''}`}
                      placeholder="Nombre"
                      disabled={isLoading}
                    />
                    {formErrors.nombre && (
                      <div className="text-error text-sm mt-1">{formErrors.nombre}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-apellido" className="form-label">Apellido</label>
                    <input
                      type="text"
                      id="edit-apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.apellido ? 'border-error' : ''}`}
                      placeholder="Apellido"
                      disabled={isLoading}
                    />
                    {formErrors.apellido && (
                      <div className="text-error text-sm mt-1">{formErrors.apellido}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      id="edit-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.telefono ? 'border-error' : ''}`}
                      placeholder="Número de teléfono"
                      disabled={isLoading}
                    />
                    {formErrors.telefono && (
                      <div className="text-error text-sm mt-1">{formErrors.telefono}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-foto" className="form-label">Foto de Perfil</label>
                    <input
                      type="file"
                      id="edit-foto"
                      name="foto"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-input"
                      disabled={isLoading}
                    />
                    {formData.foto && (
                      <div className="mt-2">
                        <img src={formData.foto} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="modal-footer justify-between">
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