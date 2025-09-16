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
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="form-group mb-0">
                <label htmlFor="search" className="form-label">
                  🔍 Buscar usuarios
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                />
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
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
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
            <div className="modal-body">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{selectedUser.username}</h4>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.username}</strong>?</p>
              <p className="text-sm text-muted mt-2">Esta acción no se puede deshacer.</p>
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
    </div>
  );
};

export default Users;