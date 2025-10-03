// ===== src/pages/Prestamos.jsx =====
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loansAPI, booksAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Prestamos = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [prestamos, setPrestamos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    bookId: "",
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    returnDate: "",
    status: "active",
    notes: ""
  });

  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Estados basados en tu modelo
  const estadosPrestamo = [
    { value: "active", label: "Activo", color: "warning" },
    { value: "returned", label: "Devuelto", color: "success" },
    { value: "overdue", label: "Vencido", color: "error" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isDataLoaded && location.state?.bookId) {
      openModal();
    }
  }, [isDataLoaded, location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('DEBUG: Prestamos loadData - Starting to fetch data');
      console.log('DEBUG: User role:', user?.role);

      let prestamosRes, usuariosRes, librosRes;

      if (user && user.role === 'admin') {
        // Admin puede ver todos los préstamos
        prestamosRes = await loansAPI.getAll();
      } else if (user && user.id) {
        // Usuario normal solo ve sus propios préstamos
        prestamosRes = await loansAPI.getUserLoans(user.id);
      } else {
        // Usuario no autenticado
        prestamosRes = [];
      }

      // Intentar cargar usuarios y libros
      try {
        usuariosRes = await usersAPI.getAll();
      } catch (err) {
        console.log('No se pudieron cargar usuarios:', err.message);
        usuariosRes = [];
      }

      try {
        librosRes = await booksAPI.getAll();
      } catch (err) {
        console.log('No se pudieron cargar libros:', err.message);
        librosRes = [];
      }

      console.log('DEBUG: Prestamos loadData - Raw responses:', { prestamosRes, usuariosRes, librosRes });

      // Mapear préstamos - el backend devuelve { loans: [...] } o array directo
      const prestamosArray = prestamosRes.loans || prestamosRes || [];
      const mappedPrestamos = prestamosArray.map(prestamo => {
        // Extraer user ID y datos
        const userId = typeof prestamo.user === 'object' ? prestamo.user._id : prestamo.user;
        const userName = typeof prestamo.user === 'object' ? prestamo.user.name : null;
        const userEmail = typeof prestamo.user === 'object' ? prestamo.user.email : null;

        // Extraer book ID y datos
        const bookId = typeof prestamo.book === 'object' ? prestamo.book._id : prestamo.book;
        const bookTitle = typeof prestamo.book === 'object' ? prestamo.book.title : null;
        const bookAuthor = typeof prestamo.book === 'object' && prestamo.book.author
          ? (typeof prestamo.book.author === 'object' ? prestamo.book.author.name : prestamo.book.author)
          : null;

        return {
          id: prestamo._id,
          userId: userId,
          bookId: bookId,
          loanDate: prestamo.loanDate,
          dueDate: prestamo.dueDate,
          returnDate: prestamo.returnDate || null,
          status: prestamo.status,
          notes: prestamo.notes || '',
          // Datos populated para mostrar
          userName: userName,
          userEmail: userEmail,
          bookTitle: bookTitle,
          bookAuthor: bookAuthor
        };
      });

      // Mapear usuarios solo si es admin
      let mappedUsuarios = [];
      if (user && user.role === 'admin') {
        const usuariosArray = Array.isArray(usuariosRes) ? usuariosRes : (usuariosRes.users || []);
        mappedUsuarios = usuariosArray.map(user => ({
          id: user._id,
          username: user.username || user.name?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0] || 'Usuario',
          email: user.email || '',
          name: user.name || 'Nombre no disponible',
          foto: user.photo || user.foto || null
        }));
      }

      // Mapear libros
      const librosArray = Array.isArray(librosRes) ? librosRes : (librosRes.books || []);
      const mappedLibros = librosArray.map(libro => ({
        id: libro._id,
        titulo: libro.title || 'Título no disponible',
        autor: libro.author?.name || libro.author || 'Autor no disponible',
        disponible: (libro.availableCopies || 0) > 0
      }));

      setPrestamos(mappedPrestamos);
      setUsuarios(mappedUsuarios);
      setLibros(mappedLibros);
      setIsDataLoaded(true);

      console.log('DEBUG: Prestamos loadData - Final data:', {
        prestamos: mappedPrestamos,
        usuarios: mappedUsuarios,
        libros: mappedLibros
      });
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrestamos = prestamos.filter(prestamo => {
    // Para usuarios no admin, solo mostrar sus propios préstamos
    if (user && user.role !== 'admin') {
      if (prestamo.userId !== user.id) {
        return false;
      }
    }

    // Usar datos populated si están disponibles, sino buscar en arrays
    const usuario = prestamo.userName
      ? { username: prestamo.userName, email: prestamo.userEmail, name: prestamo.userName }
      : usuarios.find(u => u.id === prestamo.userId);

    const libro = prestamo.bookTitle
      ? { titulo: prestamo.bookTitle, autor: prestamo.bookAuthor }
      : libros.find(l => l.id === prestamo.bookId);

    if (!searchTerm || searchTerm.trim() === '') {
      const matchesStatus = !filterStatus || prestamo.status === filterStatus;
      return matchesStatus;
    }

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (usuario?.username?.toLowerCase()?.includes(searchLower)) ||
      (usuario?.name?.toLowerCase()?.includes(searchLower)) ||
      (usuario?.email?.toLowerCase()?.includes(searchLower)) ||
      (libro?.titulo?.toLowerCase()?.includes(searchLower)) ||
      (libro?.autor?.toLowerCase()?.includes(searchLower));

    const matchesStatus = !filterStatus || prestamo.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      console.log('user:', user);
      console.log('formData.userId:', formData.userId);

      if (user?.role === 'admin' && !formData.userId) {
        setError('Debes seleccionar un usuario');
        return;
      }

      if (!formData.bookId) {
        setError('Debes seleccionar un libro');
        return;
      }

      // Preparar datos según lo que espera el backend
      const dataToSend = {
        userId: formData.userId,
        bookId: formData.bookId,
        dueDate: formData.dueDate,
        status: formData.status
      };

      if (user?.id) {
        dataToSend.createdBy = user.id;
      }

      // Solo incluir returnDate si tiene valor
      if (formData.returnDate) {
        dataToSend.returnDate = formData.returnDate;
      }

      if (formData.notes) {
        dataToSend.notes = formData.notes;
      }

      if (editingLoan) {
        // Para actualizar, usar los campos que espera el backend
        await loansAPI.update(editingLoan.id, {
          user: formData.userId,
          book: formData.bookId,
          dueDate: formData.dueDate,
          status: formData.status
        });
        setSuccess('Préstamo actualizado exitosamente');
      } else {
        await loansAPI.create(dataToSend);
        setSuccess('Préstamo registrado exitosamente');
      }
      await loadData();
      closeModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al guardar el préstamo: ' + err.message);
      console.error('Error saving loan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prestamo) => {
    setEditingLoan(prestamo);
    setFormData({
      userId: prestamo.userId,
      bookId: prestamo.bookId,
      loanDate: prestamo.loanDate ? prestamo.loanDate.split('T')[0] : new Date().toISOString().split('T')[0],
      dueDate: prestamo.dueDate ? prestamo.dueDate.split('T')[0] : "",
      returnDate: prestamo.returnDate ? prestamo.returnDate.split('T')[0] : "",
      status: prestamo.status,
      notes: prestamo.notes || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      try {
        setLoading(true);
        setError(null);
        await loansAPI.delete(id);
        await loadData();
      } catch (err) {
        setError('Error al eliminar el préstamo: ' + err.message);
        console.error('Error deleting loan:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReturn = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await loansAPI.returnBook(id);
      await loadData();
    } catch (err) {
      setError('Error al devolver el libro: ' + err.message);
      console.error('Error returning book:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEditingLoan(null);
    setSuccess(null);
    setError(null);
    // Calcular fecha de vencimiento (15 días desde hoy)
    const today = new Date();
    const dueDate = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000));

    setFormData({
      userId: user?.role !== 'admin' ? user?.id : "",
      bookId: location.state?.bookId || "",
      loanDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: "",
      status: "active",
      notes: ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLoan(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calcularDiasRestantes = (dueDate, status) => {
    if (status === "returned") return null;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(dueDate);
    vencimiento.setHours(0, 0, 0, 0);
    
    const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const prestamosActivos = prestamos.filter(p => p.status === "active").length;
  const prestamosVencidos = prestamos.filter(p => p.status === "overdue").length;

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        {loading && <LoadingSpinner />}
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">📋 Gestión de Préstamos</h1>
              <p className="text-muted">Administra los préstamos de libros</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center">
              <div className="card p-3 text-center flex-1 min-w-[150px]">
                <div className="text-lg font-bold text-warning-600">{prestamosActivos}</div>
                <div className="text-xs text-muted">Activos</div>
              </div>
              <div className="card p-3 text-center flex-1 min-w-[150px]">
                <div className="text-lg font-bold text-error-600">{prestamosVencidos}</div>
                <div className="text-xs text-muted">Vencidos</div>
              </div>
              <div className="card p-3 text-center flex-1 min-w-[150px]">
                <div className="text-lg font-bold text-accent">{prestamos.length}</div>
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

          {success && (
            <div className="card mb-6">
              <div className="alert alert-success">
                {success}
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="form-label">
                    🔍 Buscar préstamos
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por usuario o libro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="w-full lg:w-48">
                  <label htmlFor="status" className="form-label">
                    Filtrar por estado
                  </label>
                  <select
                    id="status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Todos los estados</option>
                    {estadosPrestamo.map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end w-full lg:w-auto">
                  <button onClick={openModal} className="btn btn-primary w-full lg:w-auto" disabled={loading}>
                    + Nuevo Préstamo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de préstamos */}
          <div className="table-container animate-slide-up">
            {filteredPrestamos.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron préstamos</h3>
                  <p className="text-muted mb-4">
                    {searchTerm || filterStatus ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando préstamos'}
                  </p>
                  {!searchTerm && !filterStatus && (
                    <button onClick={openModal} className="btn btn-primary">
                      + Registrar primer préstamo
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-full">
                  <thead>
                    <tr>
                      <th className="min-w-48">Usuario</th>
                      <th className="min-w-48">Libro</th>
                      <th className="min-w-32">Fecha Préstamo</th>
                      <th className="min-w-32">Fecha Vencimiento</th>
                      <th className="min-w-32">Días Restantes</th>
                      <th className="min-w-24">Estado</th>
                      <th className="min-w-64">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrestamos.map((prestamo) => {
                      // Usar datos populated si están disponibles
                      const usuario = prestamo.userName 
                        ? { username: prestamo.userName, email: prestamo.userEmail, name: prestamo.userName }
                        : usuarios.find(u => u.id === prestamo.userId);
                        
                      const libro = prestamo.bookTitle
                        ? { titulo: prestamo.bookTitle, autor: prestamo.bookAuthor }
                        : libros.find(l => l.id === prestamo.bookId);
                        
                      const diasRestantes = calcularDiasRestantes(prestamo.dueDate, prestamo.status);
                      const estado = estadosPrestamo.find(e => e.value === prestamo.status);

                      return (
                        <tr key={prestamo.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                                {usuario?.foto ? (
                                  <img src={usuario.foto} alt="Foto" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  (usuario?.username || usuario?.name || 'U')?.charAt(0)?.toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{usuario?.name || usuario?.username || 'Usuario eliminado'}</div>
                                <div className="text-xs text-muted truncate">{usuario?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{libro?.titulo || 'Libro eliminado'}</div>
                              <div className="text-xs text-muted truncate">{libro?.autor}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap">
                            {new Date(prestamo.loanDate).toLocaleDateString('es-ES')}
                          </td>
                          <td className="whitespace-nowrap">
                            {prestamo.dueDate ? new Date(prestamo.dueDate).toLocaleDateString('es-ES') : '-'}
                          </td>
                          <td>
                            {prestamo.status === "returned" ? (
                              <span className="text-success-600 font-medium">✓ Devuelto</span>
                            ) : diasRestantes === null ? (
                              <span className="text-muted">-</span>
                            ) : diasRestantes < 0 ? (
                              <span className="text-error-600 font-semibold">
                                {Math.abs(diasRestantes)} días vencido
                              </span>
                            ) : diasRestantes === 0 ? (
                              <span className="text-warning-600 font-semibold">
                                ¡Vence hoy!
                              </span>
                            ) : (
                              <span className={diasRestantes <= 3 ? "text-warning-600" : "text-muted"}>
                                {diasRestantes} días
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium alert-${estado?.color || 'info'}`}>
                              {estado?.label || prestamo.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {(user && user.role === 'admin') || (user && prestamo.userId === user.id) ? (
                                <button
                                  onClick={() => handleEdit(prestamo)}
                                  className="btn btn-secondary text-xs px-2 py-1"
                                  disabled={loading}
                                >
                                  Editar
                                </button>
                              ) : null}
                              {prestamo.status === "active" && (
                                <button
                                  onClick={() => handleReturn(prestamo.id)}
                                  className="btn btn-success text-xs px-2 py-1"
                                  disabled={loading}
                                >
                                  Devolver
                                </button>
                              )}
                              {user && user.role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(prestamo.id)}
                                  className="btn btn-danger text-xs px-2 py-1"
                                  disabled={loading}
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                {editingLoan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
              </h3>
              <button onClick={closeModal} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="userId" className="form-label">Usuario *</label>
                    {user && user.role !== 'admin' ? (
                      <input
                        type="text"
                        value={user.name || user.username || 'Usuario actual'}
                        className="form-input"
                        disabled
                        readOnly
                      />
                    ) : (
                      <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Seleccionar usuario</option>
                        {usuarios.map(usuario => (
                          <option key={usuario.id} value={usuario.id}>
                            {usuario.name || usuario.username} ({usuario.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookId" className="form-label">Libro *</label>
                    {editingLoan || !formData.bookId ? (
                      <select
                        id="bookId"
                        name="bookId"
                        required
                        value={formData.bookId}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Seleccionar libro</option>
                        {libros.filter(libro => {
                          if (editingLoan && libro.id === editingLoan.bookId) {
                            return true;
                          }
                          return libro.disponible;
                        }).map(libro => (
                          <option key={libro.id} value={libro.id}>
                            {libro.titulo} - {libro.autor}
                            {editingLoan && libro.id === editingLoan.bookId && !libro.disponible ? ' (Préstamo actual)' : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      (() => {
                        const selectedBook = libros.find(l => l.id === formData.bookId);
                        return (
                          <input
                            type="text"
                            value={selectedBook ? `${selectedBook.titulo} - ${selectedBook.autor}` : ''}
                            className="form-input"
                            readOnly
                          />
                        );
                      })()
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dueDate" className="form-label">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      required
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">Estado *</label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {estadosPrestamo.map(estado => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label htmlFor="notes" className="form-label">Observaciones</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-between">
                {error && <div className="alert alert-error mb-4 w-full">{error}</div>}
                <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {editingLoan ? 'Actualizar' : 'Registrar'} Préstamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prestamos;