// ===== src/pages/Escritores.jsx =====
import { useState, useEffect } from "react";
import { authorsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  validateRequired,
  validateMinLength,
  validateMaxLength
} from "../utils/validators";

const Escritores = () => {
  const { user } = useAuth();
  const [escritores, setEscritores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
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
  const [formErrors, setFormErrors] = useState({});

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

  // Función para mapear datos del frontend al formato del backend
  const mapToBackend = (formData) => {
    return {
      name: `${formData.nombre} ${formData.apellido}`.trim(),
      nationality: formData.nacionalidad,
      genre: formData.generoLiterario,
      biography: formData.biografia || '',
      photo: formData.fotografiaUrl || '',
      works: formData.obrasDestacadas || '',
      awards: formData.premiosRecomendaciones || '',
      language: formData.idiomaPrincipal,
      socialMedia: formData.redesSociales || ''
    };
  };

  useEffect(() => {
    loadEscritores();
  }, []);

  const loadEscritores = async () => {
    try {
      setLoading(true);
      setError(null);
      const autoresData = await authorsAPI.getAll();
      // Verificar que autoresData sea un array
      const autoresArray = Array.isArray(autoresData) ? autoresData : (autoresData.authors || []);
      // Mapear los campos del backend al formato del frontend
      const mappedEscritores = autoresArray.map(autor => ({
        id: autor._id,
        nombre: autor.name.split(' ')[0] || '',
        apellido: autor.name.split(' ').slice(1).join(' ') || '',
        nacionalidad: autor.nationality,
        generoLiterario: autor.genre || 'Novela', // Campo por defecto si no existe
        biografia: autor.biography || '',
        fotografiaUrl: autor.photo || '',
        obrasDestacadas: autor.works || '',
        premiosRecomendaciones: autor.awards || '',
        idiomaPrincipal: autor.language || 'Español',
        redesSociales: autor.socialMedia || '',
        fechaCreacion: autor.createdAt
      }));
      setEscritores(mappedEscritores);
      console.log('DEBUG Escritores: Escritores cargados exitosamente, cantidad:', mappedEscritores.length);
    } catch (err) {
      setError('Error al cargar los escritores: ' + err.message);
      console.error('Error loading authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar nombre
    const nombreValidation = validateRequired(formData.nombre, "Nombre");
    if (!nombreValidation.isValid) errors.nombre = nombreValidation.error;

    const nombreLength = validateMinLength(formData.nombre, 2, "Nombre");
    if (!nombreLength.isValid) errors.nombre = nombreLength.error;

    const nombreMaxLength = validateMaxLength(formData.nombre, 50, "Nombre");
    if (!nombreMaxLength.isValid) errors.nombre = nombreMaxLength.error;

    // Validar apellido
    const apellidoValidation = validateRequired(formData.apellido, "Apellido");
    if (!apellidoValidation.isValid) errors.apellido = apellidoValidation.error;

    const apellidoLength = validateMinLength(formData.apellido, 2, "Apellido");
    if (!apellidoLength.isValid) errors.apellido = apellidoLength.error;

    const apellidoMaxLength = validateMaxLength(formData.apellido, 50, "Apellido");
    if (!apellidoMaxLength.isValid) errors.apellido = apellidoMaxLength.error;

    // Validar nacionalidad
    const nacionalidadValidation = validateRequired(formData.nacionalidad, "Nacionalidad");
    if (!nacionalidadValidation.isValid) errors.nacionalidad = nacionalidadValidation.error;

    // Validar género literario
    const generoValidation = validateRequired(formData.generoLiterario, "Género literario");
    if (!generoValidation.isValid) errors.generoLiterario = generoValidation.error;

    // Validar idioma principal
    const idiomaValidation = validateRequired(formData.idiomaPrincipal, "Idioma principal");
    if (!idiomaValidation.isValid) errors.idiomaPrincipal = idiomaValidation.error;

    // Validar biografía
    const bioMaxLength = validateMaxLength(formData.biografia, 1000, "Biografía");
    if (!bioMaxLength.isValid) errors.biografia = bioMaxLength.error;

    // Validar obras destacadas
    const obrasMaxLength = validateMaxLength(formData.obrasDestacadas, 500, "Obras destacadas");
    if (!obrasMaxLength.isValid) errors.obrasDestacadas = obrasMaxLength.error;

    // Validar premios
    const premiosMaxLength = validateMaxLength(formData.premiosRecomendaciones, 500, "Premios");
    if (!premiosMaxLength.isValid) errors.premiosRecomendaciones = premiosMaxLength.error;

    // Validar redes sociales
    const redesMaxLength = validateMaxLength(formData.redesSociales, 300, "Redes sociales");
    if (!redesMaxLength.isValid) errors.redesSociales = redesMaxLength.error;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canEditAuthor = (autor) => {
    return user?.role === 'admin' || autor.createdBy === user?._id;
  };

  const filteredEscritores = escritores.filter(escritor =>
    `${escritor.nombre} ${escritor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escritor.nacionalidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    escritor.generoLiterario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (escritor.idiomaPrincipal && escritor.idiomaPrincipal.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (escritor.premiosRecomendaciones && escritor.premiosRecomendaciones.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('DEBUG Escritores: formData:', formData);
    console.log('DEBUG Escritores: editingAuthor:', editingAuthor);

    try {
      setLoading(true);
      setError(null);
      const backendData = mapToBackend(formData);
      console.log('DEBUG Escritores: backendData:', backendData);
      if (editingAuthor) {
        console.log('DEBUG Escritores: updating author id:', editingAuthor.id);
        const response = await authorsAPI.update(editingAuthor.id, backendData);
        console.log('DEBUG Escritores: update response:', response);
      } else {
        const response = await authorsAPI.create(backendData);
        console.log('DEBUG Escritores: create response:', response);
      }
      await loadEscritores();
      closeModal();
    } catch (err) {
      console.error('DEBUG Escritores: Error completo:', err);
      console.error('DEBUG Escritores: Error message:', err.message);
      console.error('DEBUG Escritores: Error stack:', err.stack);
      setError('Error al guardar el escritor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (escritor) => {
    if (!canEditAuthor(escritor)) {
      alert('No tienes permisos para editar este autor');
      return;
    }
    setEditingAuthor(escritor);
    setFormData({ ...escritor });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const autor = escritores.find(e => e.id === id);
    if (!canEditAuthor(autor)) {
      alert('No tienes permisos para eliminar este autor');
      return;
    }
    if (window.confirm("¿Estás seguro de que deseas eliminar este escritor?")) {
      try {
        setLoading(true);
        setError(null);
        await authorsAPI.delete(id);
        await loadEscritores();
      } catch (err) {
        setError('Error al eliminar el escritor: ' + err.message);
        console.error('Error deleting author:', err);
      } finally {
        setLoading(false);
      }
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
    setFormErrors({});
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
    setFormErrors({});
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

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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

  const toggleExpanded = (id) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        {loading && <LoadingSpinner />}
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 text-center">✍️ Gestión de Escritores</h1>
              <p className="text-muted text-center">Administra la base de datos de autores</p>
            </div>
            <div className="card p-1 text-center" style={{ width: '201px' }}>
              <div className="text-sm font-bold text-accent">{escritores.length}</div>
              <div className="text-xs text-muted">Escritores registrados</div>
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
                {filteredEscritores.map((escritor) => {
                  const isExpanded = expandedCards.has(escritor.id);
                  return (
                    <div key={escritor.id} className="card hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => toggleExpanded(escritor.id)}>
                      <div className="card-body text-center">
                        {escritor.fotografiaUrl ? (
                          <img
                            src={escritor.fotografiaUrl}
                            alt={`${escritor.nombre} ${escritor.apellido}`}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 ${escritor.fotografiaUrl ? 'hidden' : ''}`}>
                          {escritor.nombre?.charAt(0)}{escritor.apellido?.charAt(0)}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {escritor.nombre} {escritor.apellido}
                        </h3>
                        {isExpanded && (
                          <>
                            <p className="text-sm text-muted mb-2">{escritor.nacionalidad}</p>
                            {escritor.idiomaPrincipal && (
                              <p className="text-xs text-muted mb-4">{escritor.idiomaPrincipal}</p>
                            )}
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
                                onClick={(e) => { e.stopPropagation(); handleEdit(escritor); }}
                                className="btn btn-secondary flex-1"
                                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                disabled={!canEditAuthor(escritor)}
                              >
                                Editar
                              </button>
                              {canEditAuthor(escritor) && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(escritor.id); }}
                                  className="btn btn-danger"
                                  style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                      className={`form-input ${formErrors.nombre ? 'border-error' : ''}`}
                      placeholder="Nombre del escritor"
                    />
                    {formErrors.nombre && (
                      <div className="text-error text-sm mt-1">{formErrors.nombre}</div>
                    )}
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
                      className={`form-input ${formErrors.apellido ? 'border-error' : ''}`}
                      placeholder="Apellido del escritor"
                    />
                    {formErrors.apellido && (
                      <div className="text-error text-sm mt-1">{formErrors.apellido}</div>
                    )}
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
                      className={`form-input ${formErrors.nacionalidad ? 'border-error' : ''}`}
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
                      className={`form-input ${formErrors.idiomaPrincipal ? 'border-error' : ''}`}
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
                      className={`form-input ${formErrors.generoLiterario ? 'border-error' : ''}`}
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
                      className={`form-input ${formErrors.obrasDestacadas ? 'border-error' : ''}`}
                      placeholder="Lista las obras más importantes separadas por comas..."
                    />
                    {formErrors.obrasDestacadas && (
                      <div className="text-error text-sm mt-1">{formErrors.obrasDestacadas}</div>
                    )}
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="premiosRecomendaciones" className="form-label">Premios o Recomendaciones</label>
                    <textarea
                      id="premiosRecomendaciones"
                      name="premiosRecomendaciones"
                      value={formData.premiosRecomendaciones}
                      onChange={handleInputChange}
                      rows="2"
                      className={`form-input ${formErrors.premiosRecomendaciones ? 'border-error' : ''}`}
                      placeholder="Premios literarios, reconocimientos, recomendaciones..."
                    />
                    {formErrors.premiosRecomendaciones && (
                      <div className="text-error text-sm mt-1">{formErrors.premiosRecomendaciones}</div>
                    )}
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="biografia" className="form-label">Biografía</label>
                    <textarea
                      id="biografia"
                      name="biografia"
                      value={formData.biografia}
                      onChange={handleInputChange}
                      rows="4"
                      className={`form-input ${formErrors.biografia ? 'border-error' : ''}`}
                      placeholder="Biografía completa del escritor..."
                    />
                    {formErrors.biografia && (
                      <div className="text-error text-sm mt-1">{formErrors.biografia}</div>
                    )}
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="redesSociales" className="form-label">Redes Sociales / Portafolio</label>
                    <textarea
                      id="redesSociales"
                      name="redesSociales"
                      value={formData.redesSociales}
                      onChange={handleInputChange}
                      rows="2"
                      className={`form-input ${formErrors.redesSociales ? 'border-error' : ''}`}
                      placeholder="Enlaces a redes sociales, sitio web, portafolio..."
                    />
                    {formErrors.redesSociales && (
                      <div className="text-error text-sm mt-1">{formErrors.redesSociales}</div>
                    )}
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