// ===== src/pages/Profile.jsx =====
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Aquí normalmente harías una llamada a la API
    console.log('Guardando perfil:', formData);
    setIsEditing(false);
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
                  <div className="form-group">
                    <label className="form-label">Nombre de usuario</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-lg">{user.username}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo electrónico</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-lg">{user.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Biografía</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="form-input"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    ) : (
                      <p className="text-lg">{user.bio || 'No hay biografía disponible'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Fecha de registro</label>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Rol</label>
                      <p className="text-sm">{user.role || "Usuario estándar"}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    {isEditing ? (
                      <>
                        <button onClick={handleSave} className="btn btn-primary">
                          Guardar Cambios
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)} 
                          className="btn btn-secondary"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="btn btn-primary"
                      >
                        Editar Perfil
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">No hay datos del usuario disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}