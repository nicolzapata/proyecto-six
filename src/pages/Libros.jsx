// src/pages/Libros.jsx
import { useState, useEffect } from "react";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    genero: "",
    fechaPublicacion: "",
    disponible: true,
    descripcion: ""
  });

  const generos = [
    "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Misterio", 
    "Romance", "Thriller", "Historia", "Biografía", "Ciencia", "Filosofía", "Poesía"
  ];

  useEffect(() => {
    loadLibros();
  }, []);

  const loadLibros = () => {
    const storedLibros = JSON.parse(localStorage.getItem("libros") || "[]");
    setLibros(storedLibros);
  };

  const filteredLibros = libros.filter(libro => {
    const matchesSearch = libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         libro.isbn.includes(searchTerm);
    const matchesGenre = !filterGenre || libro.genero === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingBook) {
      // Editar libro existente
      const updatedLibros = libros.map(libro =>
        libro.id === editingBook.id
          ? { ...formData, id: editingBook.id }
          : libro
      );
      setLibros(updatedLibros);
      localStorage.setItem("libros", JSON.stringify(updatedLibros));
    } else {
      // Crear nuevo libro
      const nuevoLibro = {
        ...formData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      };
      const updatedLibros = [...libros, nuevoLibro];
      setLibros(updatedLibros);
      localStorage.setItem("libros", JSON.stringify(updatedLibros));
    }
    
    closeModal();
  };

  const handleEdit = (libro) => {
    setEditingBook(libro);
    setFormData({ ...libro });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      const updatedLibros = libros.filter(libro => libro.id !== id);
      setLibros(updatedLibros);
      localStorage.setItem("libros", JSON.stringify(updatedLibros));
    }
  };

  const toggleDisponibilidad = (id) => {
    const updatedLibros = libros.map(libro =>
      libro.id === id
        ? { ...libro, disponible: !libro.disponible }
        : libro
    );
    setLibros(updatedLibros);
    localStorage.setItem("libros", JSON.stringify(updatedLibros));
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
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const librosDisponibles = libros.filter(libro => libro.disponible).length;
  const librosPrestados = libros.length - librosDisponibles;

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">📖 Gestión de Libros</h1>
              <p className="text-muted">Administra la colección de la biblioteca</p>
            </div>
            <div className="flex gap-4">
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-success-600">{librosDisponibles}</div>
                  <div className="text-sm text-muted">Disponibles</div>
                </div>
              </div>
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-warning-600">{librosPrestados}</div>
                  <div className="text-sm text-muted">Prestados</div>
                </div>
              </div>
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{libros.length}</div>
                  <div className="text-sm text-muted">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex gap-4">
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
                <div className="w-48">
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
                <div className="flex items-end">
                  <button onClick={openModal} className="btn btn-primary">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibros.map((libro) => (
                  <div key={libro.id} className="card hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                            {libro.titulo}
                          </h3>
                          <p className="text-muted text-sm mb-2">por {libro.autor}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          libro.disponible 
                            ? 'bg-success-50 text-success-600' 
                            : 'bg-error-50 text-error-600'
                        }`}>
                          {libro.disponible ? 'Disponible' : 'Prestado'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">ISBN:</span>
                          <span>{libro.isbn}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Género:</span>
                          <span>{libro.genero}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Publicación:</span>
                          <span>{new Date(libro.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>

                      {libro.descripcion && (
                        <p className="text-sm text-muted mb-4 line-clamp-3">
                          {libro.descripcion}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(libro)}
                          className="btn btn-secondary flex-1"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleDisponibilidad(libro.id)}
                          className={`btn flex-1 ${libro.disponible ? 'btn-warning' : 'btn-success'}`}
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          {libro.disponible ? 'Prestar' : 'Devolver'}
                        </button>
                        <button
                          onClick={() => handleDelete(libro.id)}
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
              <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="form-input"
                      placeholder="Título del libro"
                    />
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
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Actualizar' : 'Agregar'} Libro
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