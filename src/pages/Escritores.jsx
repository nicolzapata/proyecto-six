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
    nacionalidad: "",
    generoLiterario: "",
    biografia: "",
    fotografiaUrl: "",
    obrasDestacadas: "",
    premiosRecomendaciones: "",
    idiomaPrincipal: "",
    redesSociales: ""
  });

  const nacionalidades = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador",
    "El Salvador", "España", "Estados Unidos", "Francia", "Guatemala", "Honduras", "Italia",
    "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Portugal", "Puerto Rico",
    "Reino Unido", "República Dominicana", "Uruguay", "Venezuela", "Alemania", "Japón",
    "Corea del Sur", "China", "India", "Rusia", "Canadá", "Australia", "Nueva Zelanda", "Otra"
  ];

  const idiomasPorPais = {
    "Argentina": ["Español"],
    "Bolivia": ["Español", "Quechua", "Aymara"],
    "Brasil": ["Portugués"],
    "Chile": ["Español"],
    "Colombia": ["Español"],
    "Costa Rica": ["Español"],
    "Cuba": ["Español"],
    "Ecuador": ["Español"],
    "El Salvador": ["Español"],
    "España": ["Español", "Catalán", "Gallego", "Euskera"],
    "Estados Unidos": ["Inglés"],
    "Francia": ["Francés"],
    "Guatemala": ["Español"],
    "Honduras": ["Español"],
    "Italia": ["Italiano"],
    "México": ["Español"],
    "Nicaragua": ["Español"],
    "Panamá": ["Español"],
    "Paraguay": ["Español", "Guaraní"],
    "Perú": ["Español", "Quechua", "Aymara"],
    "Portugal": ["Portugués"],
    "Puerto Rico": ["Español", "Inglés"],
    "Reino Unido": ["Inglés"],
    "República Dominicana": ["Español"],
    "Uruguay": ["Español"],
    "Venezuela": ["Español"],
    "Alemania": ["Alemán"],
    "Japón": ["Japonés"],
    "Corea del Sur": ["Coreano"],
    "China": ["Chino mandarín"],
    "India": ["Hindi", "Inglés", "Bengalí", "Telugu"],
    "Rusia": ["Ruso"],
    "Canadá": ["Inglés", "Francés"],
    "Australia": ["Inglés"],
    "Nueva Zelanda": ["Inglés", "Maorí"],
    "Otra": ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Otro"]
  };

  const generosLiterarios = [
    "Novela", "Cuento", "Poesía", "Teatro", "Ensayo", "Biografía", "Historia",
    "Ciencia ficción", "Fantasía", "Misterio", "Romance", "Thriller", "Terror",
    "Aventura", "Drama", "Comedia", "Literatura infantil", "Poesía contemporánea",
    "Novela histórica", "Ficción histórica", "Autobiografía", "Memorias"
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
    escritor.generoLiterario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (escritor.idiomaPrincipal && escritor.idiomaPrincipal.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (escritor.premiosRecomendaciones && escritor.premiosRecomendaciones.toLowerCase().includes(searchTerm.toLowerCase()))
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
      nacionalidad: "",
      generoLiterario: "",
      biografia: "",
      fotografiaUrl: "",
      obrasDestacadas: "",
      premiosRecomendaciones: "",
      idiomaPrincipal: "",
      redesSociales: ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuthor(null);
    setFormData({
      nombre: "",
      apellido: "",
      nacionalidad: "",
      generoLiterario: "",
      biografia: "",
      fotografiaUrl: "",
      obrasDestacadas: "",
      premiosRecomendaciones: "",
      idiomaPrincipal: "",
      redesSociales: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Si cambia la nacionalidad, resetear el idioma principal
      if (name === 'nacionalidad') {
        newData.idiomaPrincipal = '';
      }

      return newData;
    });
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
                    placeholder="Buscar por nombre, nacionalidad, género, idioma o premios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={openModal} className="btn btn-primary">
                    Agregar escritor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de escritores */}
          <div className="animate-slide-up">
            {filteredEscritores.length === 0 ? (
              <div className="text-center text-muted py-8">
                <h3>No hay escritores registrados.</h3>
                <p>Agrega el primer escritor usando el botón.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEscritores.map((escritor) => (
                  <div key={escritor.id} className="card hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex items-center gap-4 mb-4">
                        {escritor.fotografiaUrl ? (
                          <img
                            src={escritor.fotografiaUrl}
                            alt={`${escritor.nombre} ${escritor.apellido}`}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg ${escritor.fotografiaUrl ? 'hidden' : ''}`}>
                          {escritor.nombre?.charAt(0)}{escritor.apellido?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {escritor.nombre} {escritor.apellido}
                          </h3>
                          <p className="text-sm text-muted">{escritor.nacionalidad}</p>
                          {escritor.idiomaPrincipal && (
                            <p className="text-xs text-muted">{escritor.idiomaPrincipal}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Género:</span>
                          <span>{escritor.generoLiterario}</span>
                        </div>
                        {escritor.premiosRecomendaciones && (
                          <div className="text-sm">
                            <span className="text-muted">Premios:</span>
                            <p className="line-clamp-1 mt-1 text-xs">{escritor.premiosRecomendaciones}</p>
                          </div>
                        )}
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
                      {escritor.redesSociales && (
                        <div className="text-xs text-accent mb-2">
                          🌐 Redes sociales disponibles
                        </div>
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
              <div className="modal-body" style={{ padding: '2rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información básica */}
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

                  {/* Ubicación e idioma */}
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
                  <div className="form-group">
                    <label htmlFor="idiomaPrincipal" className="form-label">Idioma Principal *</label>
                    <select
                      id="idiomaPrincipal"
                      name="idiomaPrincipal"
                      required
                      value={formData.idiomaPrincipal}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar idioma</option>
                      {formData.nacionalidad && idiomasPorPais[formData.nacionalidad] ?
                        idiomasPorPais[formData.nacionalidad].map(idioma => (
                          <option key={idioma} value={idioma}>{idioma}</option>
                        )) :
                        idiomasPorPais["Otra"].map(idioma => (
                          <option key={idioma} value={idioma}>{idioma}</option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Información literaria */}
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

                  {/* Fotografía */}
                  <div className="form-group md:col-span-2">
                    <label htmlFor="fotografiaUrl" className="form-label">Fotografía (URL)</label>
                    <input
                      type="url"
                      id="fotografiaUrl"
                      name="fotografiaUrl"
                      value={formData.fotografiaUrl}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://ejemplo.com/foto.jpg"
                    />
                  </div>

                  {/* Contenido literario */}
                  <div className="form-group md:col-span-2">
                    <label htmlFor="obrasDestacadas" className="form-label">Obras Destacadas</label>
                    <textarea
                      id="obrasDestacadas"
                      name="obrasDestacadas"
                      value={formData.obrasDestacadas}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Lista las obras más importantes separadas por comas..."
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="premiosRecomendaciones" className="form-label">Premios o Recomendaciones</label>
                    <textarea
                      id="premiosRecomendaciones"
                      name="premiosRecomendaciones"
                      value={formData.premiosRecomendaciones}
                      onChange={handleInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Premios literarios, reconocimientos, recomendaciones..."
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
                      placeholder="Biografía completa del escritor..."
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="redesSociales" className="form-label">Redes Sociales / Portafolio</label>
                    <textarea
                      id="redesSociales"
                      name="redesSociales"
                      value={formData.redesSociales}
                      onChange={handleInputChange}
                      rows="2"
                      className="form-input"
                      placeholder="Enlaces a redes sociales, sitio web, portafolio..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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