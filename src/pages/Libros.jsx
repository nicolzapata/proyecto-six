// src/pages/Libros.jsx
import { useState, useEffect } from "react";
import { booksAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  validateISBN,
  validateFechaPublicacion,
  validateRequired,
  validateMinLength,
  validateMaxLength
} from "../utils/validators";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    genero: "",
    fechaPublicacion: "",
    disponible: true,
    descripcion: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generos = [
    "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Misterio", 
    "Romance", "Thriller", "Historia", "Biografía", "Ciencia", "Filosofía", "Poesía"
  ];

  useEffect(() => {
    loadLibros();
  }, []);

  const loadLibros = async () => {
    try {
      setLoading(true);
      setError(null);
      const librosData = await booksAPI.getAll();
      // Verificar que librosData sea un array
      const librosArray = Array.isArray(librosData) ? librosData : (librosData.books || []);
      // Mapear los campos del backend al formato del frontend
      const mappedLibros = librosArray.map(libro => ({
        id: libro._id,
        titulo: libro.title,
        autor: libro.author?.name || libro.author,
        isbn: libro.isbn,
        genero: libro.genre,
        fechaPublicacion: libro.publicationDate || '',
        disponible: libro.availableCopies > 0,
        descripcion: libro.description || '',
        fechaCreacion: libro.createdAt
      }));
      setLibros(mappedLibros);
    } catch (err) {
      setError('Error al cargar los libros: ' + err.message);
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLibros = libros.filter(libro => {
    const matchesSearch = libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         libro.isbn.includes(searchTerm);
    const matchesGenre = !filterGenre || libro.genero === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const validateForm = () => {
    const errors = {};

    // Validar título
    const tituloValidation = validateRequired(formData.titulo, "Título");
    if (!tituloValidation.isValid) errors.titulo = tituloValidation.error;

    const tituloLength = validateMinLength(formData.titulo, 2, "Título");
    if (!tituloLength.isValid) errors.titulo = tituloLength.error;

    const tituloMaxLength = validateMaxLength(formData.titulo, 200, "Título");
    if (!tituloMaxLength.isValid) errors.titulo = tituloMaxLength.error;

    // Validar autor
    const autorValidation = validateRequired(formData.autor, "Autor");
    if (!autorValidation.isValid) errors.autor = autorValidation.error;

    const autorLength = validateMinLength(formData.autor, 2, "Autor");
    if (!autorLength.isValid) errors.autor = autorLength.error;

    // Validar ISBN
    const isbnValidation = validateISBN(formData.isbn);
    if (!isbnValidation.isValid) errors.isbn = isbnValidation.error;

    // Validar género
    const generoValidation = validateRequired(formData.genero, "Género");
    if (!generoValidation.isValid) errors.genero = generoValidation.error;

    // Validar fecha de publicación
    const fechaValidation = validateFechaPublicacion(formData.fechaPublicacion);
    if (!fechaValidation.isValid) errors.fechaPublicacion = fechaValidation.error;

    // Validar descripción
    const descMaxLength = validateMaxLength(formData.descripcion, 1000, "Descripción");
    if (!descMaxLength.isValid) errors.descripcion = descMaxLength.error;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingBook) {
        // Editar libro existente
        await booksAPI.update(editingBook.id, formData);
      } else {
        // Crear nuevo libro
        await booksAPI.create(formData);
      }

      await loadLibros();
      closeModal();
    } catch (error) {
      console.error('Error al guardar libro:', error);
      setError('Error al guardar el libro: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (libro) => {
    setEditingBook(libro);
    setFormData({ ...libro });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        setLoading(true);
        setError(null);
        await booksAPI.delete(id);
        await loadLibros();
      } catch (err) {
        setError('Error al eliminar el libro: ' + err.message);
        console.error('Error deleting book:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDisponibilidad = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const libro = libros.find(l => l.id === id);
      if (libro) {
        await booksAPI.update(id, { disponible: !libro.disponible });
        await loadLibros();
      }
    } catch (err) {
      setError('Error al actualizar la disponibilidad: ' + err.message);
      console.error('Error updating book availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEditingBook(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      genero: "",
      fechaPublicacion: "",
      disponible: true,
      descripcion: ""
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      genero: "",
      fechaPublicacion: "",
      disponible: true,
      descripcion: ""
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const librosDisponibles = libros.filter(libro => libro.disponible).length;
  const librosPrestados = libros.length - librosDisponibles;

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        {loading && <LoadingSpinner />}
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">📖 Gestión de Libros</h1>
              <p className="text-muted text-center">Administra la colección de la biblioteca</p>
            </div>
            <div className="flex flex-nowrap gap-1 w-auto justify-center">
              <div className="card p-1 text-center" style={{ width: '201px' }}>
                <div className="text-sm font-bold text-success-600">{librosDisponibles}</div>
                <div className="text-xs text-muted">Disponibles</div>
              </div>
              <div className="card p-1 text-center" style={{ width: '201px' }}>
                <div className="text-sm font-bold text-warning-600">{librosPrestados}</div>
                <div className="text-xs text-muted">Prestados</div>
              </div>
              <div className="card p-1 text-center" style={{ width: '201px' }}>
                <div className="text-sm font-bold text-accent">{libros.length}</div>
                <div className="text-xs text-muted">Total</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="card mb-6">
              <div className="alert alert-error">
                {error}
              </div>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="form-label">
                    🔍 Buscar libros
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por título, autor o ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="w-full lg:w-48">
                  <label htmlFor="genre" className="form-label">
                    Filtrar por género
                  </label>
                  <select
                    id="genre"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Todos los géneros</option>
                    {generos.map(genero => (
                      <option key={genero} value={genero}>{genero}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end w-full lg:w-auto">
                  <button onClick={openModal} className="btn btn-primary w-full lg:w-auto" disabled={loading}>
                    + Agregar Libro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de libros */}
          <div className="animate-slide-up">
            {filteredLibros.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron libros</h3>
                  <p className="text-muted mb-4">
                    {searchTerm || filterGenre ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando libros a la biblioteca'}
                  </p>
                  {!searchTerm && !filterGenre && (
                    <button onClick={openModal} className="btn btn-primary">
                      + Agregar primer libro
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredLibros.map((libro) => (
                  <div key={libro.id} className="card hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">
                            {libro.titulo}
                          </h3>
                          <p className="text-muted text-sm mb-2">por {libro.autor}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium self-start ${
                          libro.disponible
                            ? 'bg-success-50 text-success-600'
                            : 'bg-error-50 text-error-600'
                        }`}>
                          {libro.disponible ? 'Disponible' : 'Prestado'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex flex-col sm:flex-row justify-between text-sm gap-1">
                          <span className="text-muted">ISBN:</span>
                          <span className="break-all">{libro.isbn}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between text-sm gap-1">
                          <span className="text-muted">Género:</span>
                          <span>{libro.genero}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between text-sm gap-1">
                          <span className="text-muted">Publicación:</span>
                          <span>{new Date(libro.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>

                      {libro.descripcion && (
                        <p className="text-sm text-muted mb-4 line-clamp-3">
                          {libro.descripcion}
                        </p>
                      )}

                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(libro)}
                          className="btn btn-secondary flex-1 text-xs sm:text-sm"
                          style={{ padding: '0.4rem 0.6rem' }}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleDisponibilidad(libro.id)}
                          className={`btn flex-1 text-xs sm:text-sm ${libro.disponible ? 'btn-warning' : 'btn-success'}`}
                          style={{ padding: '0.4rem 0.6rem' }}
                          disabled={loading}
                        >
                          {libro.disponible ? 'Prestar' : 'Devolver'}
                        </button>
                        <button
                          onClick={() => handleDelete(libro.id)}
                          className="btn btn-danger text-xs sm:text-sm"
                          style={{ padding: '0.4rem 0.6rem' }}
                          disabled={loading}
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

      {/* Modal para agregar/editar libro */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingBook ? 'Editar Libro' : 'Agregar Nuevo Libro'}
              </h3>
              <button onClick={closeModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '2rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="titulo" className="form-label">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      required
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.titulo ? 'border-error' : ''}`}
                      placeholder="Título del libro"
                      disabled={isSubmitting}
                    />
                    {formErrors.titulo && (
                      <div className="text-error text-sm mt-1">{formErrors.titulo}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="autor" className="form-label">
                      Autor *
                    </label>
                    <input
                      type="text"
                      id="autor"
                      name="autor"
                      required
                      value={formData.autor}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nombre del autor"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="isbn" className="form-label">
                      ISBN
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="978-3-16-148410-0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="genero" className="form-label">
                      Género *
                    </label>
                    <select
                      id="genero"
                      name="genero"
                      required
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar género</option>
                      {generos.map(genero => (
                        <option key={genero} value={genero}>{genero}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaPublicacion" className="form-label">
                      Fecha de Publicación
                    </label>
                    <input
                      type="date"
                      id="fechaPublicacion"
                      name="fechaPublicacion"
                      value={formData.fechaPublicacion}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group flex items-center">
                    <input
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={formData.disponible}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="disponible" className="form-label mb-0">
                      Disponible para préstamo
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-input"
                    placeholder="Breve descripción del libro..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      {editingBook ? 'Actualizando...' : 'Agregando...'}
                    </>
                  ) : (
                    `${editingBook ? 'Actualizar' : 'Agregar'} Libro`
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

export default Libros;