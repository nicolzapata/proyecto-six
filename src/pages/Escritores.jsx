// ===== src/pages/Escritores.jsx =====
import { useState, useEffect } from "react";

const Escritores = () => {
  const [escritores, setEscritores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    nacionalidad: "",
    biografia: "",
    generoLiterario: "",
    obrasDestacadas: ""
  });

  const nacionalidades = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador",
    "El Salvador", "España", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá",
    "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela", "Otra"
  ];

  const generosLiterarios = [
    "Novela", "Cuento", "Poesía", "Teatro", "Ensayo", "Biografía", "Historia",
    "Ciencia ficción", "Fantasía", "Misterio", "Romance", "Thriller"
  ];

  useEffect(() => {
    loadEscritores();
  }, []);

  const loadEscritores = () => {
    const storedEscritores = JSON.parse(localStorage.getItem("escritores") || "[]");
    setEscritores(storedEscritores);
  };

  const filteredEscritores = escritores.filter(escritor =>
    `${escritor.nombre} ${escritor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escritor.nacionalidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escritor.generoLiterario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAuthor) {
      const updatedEscritores = escritores.map(escritor =>
        escritor.id === editingAuthor.id
          ? { ...formData, id: editingAuthor.id }
          : escritor
      );
      setEscritores(updatedEscritores);
      localStorage.setItem("escritores", JSON.stringify(updatedEscritores));
    } else {
      const nuevoEscritor = {
        ...formData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      };
      const updatedEscritores = [...escritores, nuevoEscritor];
      setEscritores(updatedEscritores);
      localStorage.setItem("escritores", JSON.stringify(updatedEscritores));
    }
    
    closeModal();
  };

  const handleEdit = (escritor) => {
    setEditingAuthor(escritor);
    setFormData({ ...escritor });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este escritor?")) {
      const updatedEscritores = escritores.filter(escritor => escritor.id !== id);
      setEscritores(updatedEscritores);
      localStorage.setItem("escritores", JSON.stringify(updatedEscritores));
    }
  };

  const openModal = () => {
    setEditingAuthor(null);
    setFormData({
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      nacionalidad: "",
      biografia: "",
      generoLiterario: "",
      obrasDestacadas: ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuthor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">✍️ Gestión de Escritores</h1>
              <p className="text-muted">Administra la base de datos de autores</p>
            </div>
            <div className="card p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-accent">{escritores.length}</div>
                <div className="text-sm text-muted">Escritores registrados</div>
              </div>
            </div>
          </div>

          {/* Buscador */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="form-label">
                    🔍 Buscar escritores
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nombre, nacionalidad o género..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={openModal} className="btn btn-primary">
                    + Agregar Escritor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de escritores */}
          <div className="animate-slide-up">
            {filteredEscritores.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-8">
                  <div className="text-4xl mb-4">✍️</div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron escritores</h3>
                  <p className="text-muted mb-4">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando escritores a la base de datos'}
                  </p>
                  {!searchTerm && (
                    <button onClick={openModal} className="btn btn-primary">
                      + Agregar primer escritor
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEscritores.map((escritor) => (
                  <div key={escritor.id} className="card hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {escritor.nombre.charAt(0)}{escritor.apellido.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {escritor.nombre} {escritor.apellido}
                          </h3>
                          <p className="text-sm text-muted">{escritor.nacionalidad}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {escritor.fechaNacimiento && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Edad:</span>
                            <span>{calcularEdad(escritor.fechaNacimiento)} años</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Género:</span>
                          <span>{escritor.generoLiterario}</span>
                        </div>
                        {escritor.obrasDestacadas && (
                          <div className="text-sm">
                            <span className="text-muted">Obras:</span>
                            <p className="line-clamp-2 mt-1">{escritor.obrasDestacadas}</p>
                          </div>
                        )}
                      </div>

                      {escritor.biografia && (
                        <p className="text-sm text-muted mb-4 line-clamp-3">
                          {escritor.biografia}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(escritor)}
                          className="btn btn-secondary flex-1"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(escritor.id)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingAuthor ? 'Editar Escritor' : 'Agregar Nuevo Escritor'}
              </h3>
              <button onClick={closeModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nombre del escritor"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="apellido" className="form-label">Apellido *</label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      required
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Apellido del escritor"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nacionalidad" className="form-label">Nacionalidad *</label>
                    <select
                      id="nacionalidad"
                      name="nacionalidad"
                      required
                      value={formData.nacionalidad}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar nacionalidad</option>
                      {nacionalidades.map(pais => (
                        <option key={pais} value={pais}>{pais}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="generoLiterario" className="form-label">Género Literario *</label>
                    <select
                      id="generoLiterario"
                      name="generoLiterario"
                      required
                      value={formData.generoLiterario}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar género</option>
                      {generosLiterarios.map(genero => (
                        <option key={genero} value={genero}>{genero}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="obrasDestacadas" className="form-label">Obras Destacadas</label>
                    <textarea
                      id="obrasDestacadas"
                      name="obrasDestacadas"
                      value={formData.obrasDestacadas}
                      onChange={handleInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Lista las obras más importantes separadas por comas..."
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="biografia" className="form-label">Biografía</label>
                    <textarea
                      id="biografia"
                      name="biografia"
                      value={formData.biografia}
                      onChange={handleInputChange}
                      rows="4"
                      className="form-input"
                      placeholder="Breve biografía del escritor..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAuthor ? 'Actualizar' : 'Agregar'} Escritor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Escritores;