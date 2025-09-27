// src/pages/Users.jsx
import { useState, useEffect } from "react";
import { usersAPI, authAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [registerFormData, setRegisterFormData] = useState({
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    email: "",
    username: ""
  });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  const tiposIdentificacion = [
    "Cédula de Ciudadanía",
    "Tarjeta de Identidad",
    "Cédula de Extranjería",
    "Pasaporte",
    "Otro"
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await usersAPI.getAll();
      // Verificar que usersData sea un array
      const usersArray = Array.isArray(usersData) ? usersData : (usersData.users || []);
      // Mapear los campos del backend al formato del frontend
      const mappedUsers = usersArray.map(user => ({
        id: user._id,
        username: user.username || user.name?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0],
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        phone: user.phone,
        address: user.address
      }));
      console.log('Usuarios mapeados:', mappedUsers);
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error completo al cargar usuarios:', err);
      setError('Error al cargar los usuarios: ' + (err.message || 'Acceso denegado. Se requieren permisos de administrador.'));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.apellido && user.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.identificacion && user.identificacion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        setLoading(true);
        setError(null);
        // Usar el _id original del backend para la API
        const backendUserId = users.find(u => u.id === userToDelete.id)?._id || userToDelete.id;
        // Asumiendo que toggleStatus desactiva al usuario en lugar de eliminarlo
        await usersAPI.toggleStatus(backendUserId);
        await loadUsers();
        setUserToDelete(null);
        setShowDeleteModal(false);
      } catch (err) {
        setError('Error al desactivar el usuario: ' + err.message);
        console.error('Error deactivating user:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openRegisterModal = () => {
    setRegisterFormData({
      tipoIdentificacion: "",
      identificacion: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
    setRegisterError("");
    setRegisterSuccess("");
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterFormData({
      tipoIdentificacion: "",
      identificacion: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
    setRegisterError("");
    setRegisterSuccess("");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      tipoIdentificacion: user.tipoIdentificacion || "",
      identificacion: user.identificacion || "",
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
      direccion: user.direccion || "",
      email: user.email || "",
      username: user.username || ""
    });
    setEditError("");
    setEditSuccess("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      tipoIdentificacion: "",
      identificacion: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      email: "",
      username: ""
    });
    setEditError("");
    setEditSuccess("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setIsEditLoading(true);

    try {
      const userData = {
        tipoIdentificacion: editFormData.tipoIdentificacion,
        identificacion: editFormData.identificacion,
        nombre: editFormData.nombre,
        apellido: editFormData.apellido,
        telefono: editFormData.telefono,
        direccion: editFormData.direccion,
        email: editFormData.email,
        username: editFormData.username
      };

      await usersAPI.update(editingUser.id, userData);
      await loadUsers();

      setEditSuccess("¡Usuario actualizado exitosamente!");

      setTimeout(() => {
        closeEditModal();
      }, 2000);
    } catch (err) {
      setEditError('Error al actualizar el usuario: ' + err.message);
      console.error('Error updating user:', err);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setIsRegisterLoading(true);

    // Validaciones
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setRegisterError("Las contraseñas no coinciden");
      setIsRegisterLoading(false);
      return;
    }

    if (registerFormData.password.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres");
      setIsRegisterLoading(false);
      return;
    }

    try {
      // Usar authAPI.register para registrar el usuario
      const userData = {
        username: registerFormData.username,
        email: registerFormData.email,
        password: registerFormData.password,
        tipoIdentificacion: registerFormData.tipoIdentificacion,
        identificacion: registerFormData.identificacion,
        nombre: registerFormData.nombre,
        apellido: registerFormData.apellido,
        telefono: registerFormData.telefono,
        direccion: registerFormData.direccion
      };

      await authAPI.register(userData);
      await loadUsers();

      setRegisterSuccess("¡Usuario registrado exitosamente!");

      setTimeout(() => {
        closeRegisterModal();
      }, 2000);
    } catch (err) {
      setRegisterError('Error al registrar el usuario: ' + err.message);
      console.error('Error registering user:', err);
    } finally {
      setIsRegisterLoading(false);
    }
  };


  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8 max-w-4xl mx-auto">
        {loading && <LoadingSpinner />}
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">👥 Gestión de Usuarios</h1>
              <p className="text-muted text-center">Administra los usuarios del sistema</p>
            </div>
            <div className="card p-1 text-center" style={{ width: '201px' }}>
              <div className="text-sm font-bold">{users.length}</div>
              <div className="text-xs text-muted">Usuarios totales</div>
            </div>
          </div>

          {error && (
            <div className="card mb-6">
              <div className="alert alert-error">
                {error}
              </div>
            </div>
          )}

          {/* Buscador */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="form-label">
                    🔍 Buscar usuarios
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nombre, apellido, email o identificación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="flex items-end w-full lg:w-auto">
                  <button onClick={openRegisterModal} className="btn btn-primary w-full lg:w-auto">
                    Registrar Usuario
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="table-container animate-slide-up">
            {filteredUsers.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-8">
                  <div className="text-4xl mb-4">👤</div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-full">
                  <thead>
                    <tr>
                      <th className="min-w-48">Usuario</th>
                      <th className="min-w-48">Email</th>
                      <th className="min-w-32">Fecha de registro</th>
                      <th className="min-w-20">Estado</th>
                      <th className="min-w-40">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                              {user.foto ? (
                                <img src={user.foto} alt="Foto" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                (user.nombre && user.apellido) ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}` : user.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username}
                              </div>
                              <div className="text-sm text-muted truncate">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="truncate max-w-48">{user.email}</td>
                        <td className="whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success-50 text-success-600">
                            Activo
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="btn btn-secondary text-xs"
                              style={{ padding: '0.3rem 0.4rem' }}
                              title="Ver detalles"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="btn btn-primary text-xs"
                              style={{ padding: '0.4rem 0.5rem' }}
                              title="Editar usuario"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="btn btn-danger text-xs"
                              style={{ padding: '0.4rem 0.5rem' }}
                              title="Eliminar usuario"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detalles del Usuario</h3>
              <button onClick={closeModal} className="modal-close">×</button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {selectedUser.foto ? (
                      <img src={selectedUser.foto} alt="Foto" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      selectedUser.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{selectedUser.username}</h4>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">ID de Usuario</label>
                    <p className="text-sm">{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="form-label">Fecha de registro</label>
                    <p className="text-sm">
                      {new Date(selectedUser.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  {selectedUser.tipoIdentificacion && (
                    <div>
                      <label className="form-label">Tipo de Identificación</label>
                      <p className="text-sm">{selectedUser.tipoIdentificacion}</p>
                    </div>
                  )}
                  {selectedUser.identificacion && (
                    <div>
                      <label className="form-label">Identificación</label>
                      <p className="text-sm">{selectedUser.identificacion}</p>
                    </div>
                  )}
                  {selectedUser.nombre && (
                    <div>
                      <label className="form-label">Nombre</label>
                      <p className="text-sm">{selectedUser.nombre}</p>
                    </div>
                  )}
                  {selectedUser.apellido && (
                    <div>
                      <label className="form-label">Apellido</label>
                      <p className="text-sm">{selectedUser.apellido}</p>
                    </div>
                  )}
                  {selectedUser.telefono && (
                    <div>
                      <label className="form-label">Teléfono</label>
                      <p className="text-sm">{selectedUser.telefono}</p>
                    </div>
                  )}
                  {selectedUser.direccion && (
                    <div className="md:col-span-2">
                      <label className="form-label">Dirección</label>
                      <p className="text-sm">{selectedUser.direccion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar eliminación</h3>
              <button onClick={closeDeleteModal} className="modal-close">×</button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <p className="mb-4">¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.username}</strong>?</p>
              <p className="text-sm text-muted">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeDeleteModal} className="btn btn-secondary">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de registro de usuario */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Registrar Nuevo Usuario</h3>
              <button onClick={closeRegisterModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="modal-body" style={{ padding: '2rem' }}>
                {registerError && (
                  <div className="alert alert-error animate-slide-down mb-6">
                    {registerError}
                  </div>
                )}

                {registerSuccess && (
                  <div className="alert alert-success animate-slide-down mb-6">
                    {registerSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="register-tipoIdentificacion" className="form-label">Tipo de Identificación *</label>
                    <select
                      id="register-tipoIdentificacion"
                      name="tipoIdentificacion"
                      required
                      value={registerFormData.tipoIdentificacion}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      disabled={isRegisterLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposIdentificacion.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-identificacion" className="form-label">Identificación *</label>
                    <input
                      type="text"
                      id="register-identificacion"
                      name="identificacion"
                      required
                      value={registerFormData.identificacion}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Número de identificación"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      id="register-nombre"
                      name="nombre"
                      required
                      value={registerFormData.nombre}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Nombre del usuario"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-apellido" className="form-label">Apellido *</label>
                    <input
                      type="text"
                      id="register-apellido"
                      name="apellido"
                      required
                      value={registerFormData.apellido}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Apellido del usuario"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-telefono" className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      id="register-telefono"
                      name="telefono"
                      required
                      value={registerFormData.telefono}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Número de teléfono"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      required
                      value={registerFormData.email}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="correo@ejemplo.com"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="register-direccion" className="form-label">Dirección *</label>
                    <textarea
                      id="register-direccion"
                      name="direccion"
                      required
                      value={registerFormData.direccion}
                      onChange={handleRegisterInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Dirección completa"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-username" className="form-label">Nombre de Usuario *</label>
                    <input
                      type="text"
                      id="register-username"
                      name="username"
                      required
                      value={registerFormData.username}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Nombre de usuario para login"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password" className="form-label">Contraseña *</label>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      required
                      value={registerFormData.password}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Mínimo 6 caracteres"
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="register-confirmPassword" className="form-label">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      id="register-confirmPassword"
                      name="confirmPassword"
                      required
                      value={registerFormData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      className="form-input"
                      placeholder="Repite la contraseña"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button type="button" onClick={closeRegisterModal} className="btn btn-secondary" disabled={isRegisterLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isRegisterLoading}>
                  {isRegisterLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Registrando...
                    </>
                  ) : (
                    "Registrar Usuario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición de usuario */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Usuario</h3>
              <button onClick={closeEditModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body" style={{ padding: '2rem' }}>
                {editError && (
                  <div className="alert alert-error animate-slide-down mb-6">
                    {editError}
                  </div>
                )}

                {editSuccess && (
                  <div className="alert alert-success animate-slide-down mb-6">
                    {editSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="edit-tipoIdentificacion" className="form-label">Tipo de Identificación *</label>
                    <select
                      id="edit-tipoIdentificacion"
                      name="tipoIdentificacion"
                      required
                      value={editFormData.tipoIdentificacion}
                      onChange={handleEditInputChange}
                      className="form-input"
                      disabled={isEditLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposIdentificacion.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-identificacion" className="form-label">Identificación *</label>
                    <input
                      type="text"
                      id="edit-identificacion"
                      name="identificacion"
                      required
                      value={editFormData.identificacion}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="Número de identificación"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      id="edit-nombre"
                      name="nombre"
                      required
                      value={editFormData.nombre}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="Nombre del usuario"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-apellido" className="form-label">Apellido *</label>
                    <input
                      type="text"
                      id="edit-apellido"
                      name="apellido"
                      required
                      value={editFormData.apellido}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="Apellido del usuario"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-telefono" className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      id="edit-telefono"
                      name="telefono"
                      required
                      value={editFormData.telefono}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="Número de teléfono"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      required
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="correo@ejemplo.com"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="edit-direccion" className="form-label">Dirección *</label>
                    <textarea
                      id="edit-direccion"
                      name="direccion"
                      required
                      value={editFormData.direccion}
                      onChange={handleEditInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Dirección completa"
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="edit-username" className="form-label">Nombre de Usuario *</label>
                    <input
                      type="text"
                      id="edit-username"
                      name="username"
                      required
                      value={editFormData.username}
                      onChange={handleEditInputChange}
                      className="form-input"
                      placeholder="Nombre de usuario para login"
                      disabled={isEditLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button type="button" onClick={closeEditModal} className="btn btn-secondary" disabled={isEditLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isEditLoading}>
                  {isEditLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar Usuario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;