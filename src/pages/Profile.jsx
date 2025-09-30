// ===== src/pages/Profile.jsx =====
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { authAPI, usersAPI, loansAPI } from "../services/api";
import {
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validateTelefono
} from "../utils/validators";
import "../styles/pages/profile.css";

export default function Profile() {
  const { user, updateUser, loadProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [stats, setStats] = useState({
    libros: 0,
    prestamos: 0,
    diasActivo: 0
  });

  const [formData, setFormData] = useState({
    username: user?.username || user?.name || '',
    email: user?.email || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    bio: user?.bio || '',
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
        bio: user.bio || '',
        foto: user.foto || ''
      });

      // Cargar estadísticas del usuario
      loadUserStats();
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

    // Validar bio
    if (formData.bio) {
      const bioMax = validateMaxLength(formData.bio, 200, "Bio");
      if (!bioMax.isValid) errors.bio = bioMax.error;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadUserStats = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      // Obtener préstamos del usuario
      const userLoans = await loansAPI.getUserLoans(userId);
      const userLoansArray = Array.isArray(userLoans) ? userLoans : [];
      const prestamosCount = userLoansArray.length;

      // Calcular libros únicos prestados (usando Set para evitar duplicados)
      const uniqueBooks = new Set(userLoansArray.map(loan => loan.bookId));
      const librosCount = uniqueBooks.size;

      // Calcular días activo
      const createdDate = new Date(user.createdAt);
      const today = new Date();
      const diasActivo = isNaN(createdDate.getTime()) ? 0 : Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

      setStats({
        libros: librosCount,
        prestamos: prestamosCount,
        diasActivo: diasActivo
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Mantener valores por defecto en caso de error
    }
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
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 200; // Tamaño máximo
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataURL = canvas.toDataURL('image/jpeg', 0.8); // Calidad 80%

          setFormData({
            ...formData,
            foto: resizedDataURL
          });
          setHasChanges(true);
        };
        img.src = e.target.result;
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
      bio: user?.bio || '',
      foto: user?.foto || ''
    });
    setError("");
    setSuccess("");
    setHasChanges(false);
    setShowConfirmModal(false);
    setShowEditModal(true);
  };

  const attemptCloseEditModal = () => {
    if (hasChanges) {
      setShowConfirmModal(true);
    } else {
      setShowEditModal(false);
      setError("");
      setSuccess("");
    }
  };

  const discardChanges = () => {
    setShowConfirmModal(false);
    setShowEditModal(false);
    setError("");
    setSuccess("");
  };

  const saveChanges = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario antes de guardar.");
      return;
    }

    const userId = user?._id || user?.id;
    if (!userId) {
      setError("Usuario no identificado. No se pueden guardar los cambios.");
      return;
    }

    setIsLoading(true);

    try {
      console.log('User ID:', userId);
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        bio: formData.bio,
        ...(formData.foto !== user?.foto && { foto: formData.foto })
      };
      console.log('Datos a enviar:', dataToSend);

      const response = await usersAPI.update(userId, dataToSend);
      console.log('Respuesta completa del servidor:', response);

      // Actualizar el contexto de autenticación con los datos enviados
      updateUser(formData);

      setSuccess("¡Perfil actualizado exitosamente!");
      setHasChanges(false);
      
      // Cerrar modales después de un pequeño delay para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        setShowEditModal(false);
        setShowConfirmModal(false);
      }, 1000);

    } catch (err) {
      console.error('Error completo al guardar perfil:', err);
      console.error('Detalles del error:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveChanges();
  };

  return (
    <div className="min-h-screen">
      <div className="profile-container">
        <div className="profile-header">
          <div className="text-center">
            <div className="profile-avatar">
              {user?.foto ? (
                <img src={user.foto} alt="Foto de perfil" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
              )}
            </div>
            <h1 className="profile-username">{user?.username || user?.name || 'Usuario'}</h1>
            {user?.bio && user.bio !== '' && <p className="profile-bio">{user.bio}</p>}
            <p className="text-muted">Gestiona tu información personal</p>
          </div>
        </div>

        <div className="animate-slide-up">
            {/* Estadísticas reales del usuario */}
            <div className="flex justify-center mb-8">
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.libros}</span>
                  <span className="stat-label">Libros</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.prestamos}</span>
                  <span className="stat-label">Préstamos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.diasActivo}</span>
                  <span className="stat-label">Días activo</span>
                </div>
              </div>
            </div>

            {/* Botón de editar */}
            <div className="text-center mb-8">
              <button
                onClick={openEditModal}
                className="edit-profile-btn"
              >
                Editar Perfil
              </button>
            </div>

            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Información de Cuenta */}
                <div className="profile-info-section">
                  <h3>Información de Cuenta</h3>
                  <div className="info-item">
                    <span className="info-label">Nombre de usuario</span>
                    <span className="info-value">{user?.username || user?.name || ''}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Correo electrónico</span>
                    <span className="info-value">{user?.email || ''}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nombre</span>
                    <span className="info-value">{user?.nombre ?? 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Apellido</span>
                    <span className="info-value">{user?.apellido ?? 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{user?.telefono ?? 'No especificado'}</span>
                  </div>
                </div>

                {/* Información del Sistema */}
                <div className="profile-info-section">
                  <h3>Información del Sistema</h3>
                  <div className="info-item">
                    <span className="info-label">Fecha de registro</span>
                    <span className="info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rol</span>
                    <span className="info-value">{user?.role || "Usuario estándar"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted">No hay datos del usuario disponibles</p>
            )}
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="modal-overlay" onClick={attemptCloseEditModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Perfil</h3>
              <button onClick={attemptCloseEditModal} className="modal-close">×</button>
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
                    <label htmlFor="edit-bio" className="form-label">Bio</label>
                    <textarea
                      id="edit-bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.bio ? 'border-error' : ''}`}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows="3"
                      disabled={isLoading}
                    />
                    {formErrors.bio && (
                      <div className="text-error text-sm mt-1">{formErrors.bio}</div>
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
                <button type="button" onClick={attemptCloseEditModal} className="btn btn-secondary" disabled={isLoading}>
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

      {/* Modal de confirmación de cambios sin guardar */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cambios sin guardar</h3>
              <button onClick={() => setShowConfirmModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <p>Tienes cambios sin guardar. ¿Qué deseas hacer?</p>
            </div>
            <div className="modal-footer justify-between">
              <button type="button" onClick={discardChanges} className="btn btn-secondary" disabled={isLoading}>
                No guardar cambios
              </button>
              <button type="button" onClick={saveChanges} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}