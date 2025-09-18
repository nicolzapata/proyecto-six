// src/pages/Users.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user: currentUser } = useAuth();

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

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
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
    if (user.id === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta");
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setUserToDelete(null);
      setShowDeleteModal(false);
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

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = existingUsers.some(
      user =>
        user.username === registerFormData.username ||
        user.email === registerFormData.email ||
        user.identificacion === registerFormData.identificacion
    );

    if (userExists) {
      setRegisterError("El nombre de usuario, email o identificación ya está registrado");
      setIsRegisterLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      username: registerFormData.username,
      email: registerFormData.email,
      password: registerFormData.password,
      tipoIdentificacion: registerFormData.tipoIdentificacion,
      identificacion: registerFormData.identificacion,
      nombre: registerFormData.nombre,
      apellido: registerFormData.apellido,
      telefono: registerFormData.telefono,
      direccion: registerFormData.direccion,
      createdAt: new Date().toISOString(),
      role: "user"
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    setRegisterSuccess("¡Usuario registrado exitosamente!");

    setTimeout(() => {
      closeRegisterModal();
    }, 2000);
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">👥 Gestión de Usuarios</h1>
              <p className="text-muted">Administra los usuarios del sistema</p>
            </div>
            <div className="card p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-accent">{users.length}</div>
                <div className="text-sm text-muted">Usuarios totales</div>
              </div>
            </div>
          </div>

          {/* Buscador */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex gap-4">
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
                <div className="flex items-end">
                  <button onClick={openRegisterModal} className="btn btn-primary">
                    ➕ Registrar Usuario
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Fecha de registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(user.nombre && user.apellido) ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}` : user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username}
                            </div>
                            <div className="text-sm text-muted">{user.username}</div>
                            {user.id === currentUser?.id && (
                              <div className="text-xs text-accent">Tú</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                          >
                            Ver
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="btn btn-danger"
                              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.username.charAt(0).toUpperCase()}
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
    </div>
  );
};

export default Users;