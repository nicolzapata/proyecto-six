// ===== src/pages/Prestamos.jsx =====
import { useState, useEffect } from "react";

const Prestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    usuarioId: "",
    libroId: "",
    fechaPrestamo: new Date().toISOString().split('T')[0],
    fechaDevolucion: "",
    estado: "activo",
    observaciones: ""
  });

  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);

  const estadosPrestamo = [
    { value: "activo", label: "Activo", color: "warning" },
    { value: "devuelto", label: "Devuelto", color: "success" },
    { value: "vencido", label: "Vencido", color: "error" },
    { value: "renovado", label: "Renovado", color: "info" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedPrestamos = JSON.parse(localStorage.getItem("prestamos") || "[]");
    const storedUsuarios = JSON.parse(localStorage.getItem("users") || "[]");
    const storedLibros = JSON.parse(localStorage.getItem("libros") || "[]");
    
    setPrestamos(storedPrestamos);
    setUsuarios(storedUsuarios);
    setLibros(storedLibros);
  };

  const filteredPrestamos = prestamos.filter(prestamo => {
    const usuario = usuarios.find(u => u.id === prestamo.usuarioId);
    const libro = libros.find(l => l.id === prestamo.libroId);
    
    const matchesSearch = 
      usuario?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro?.autor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || prestamo.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingLoan) {
      const updatedPrestamos = prestamos.map(prestamo =>
        prestamo.id === editingLoan.id
          ? { ...formData, id: editingLoan.id }
          : prestamo
      );
      setPrestamos(updatedPrestamos);
      localStorage.setItem("prestamos", JSON.stringify(updatedPrestamos));
    } else {
      const nuevoPrestamo = {
        ...formData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      };
      const updatedPrestamos = [...prestamos, nuevoPrestamo];
      setPrestamos(updatedPrestamos);
      localStorage.setItem("prestamos", JSON.stringify(updatedPrestamos));
    }
    
    closeModal();
  };

  const handleEdit = (prestamo) => {
    setEditingLoan(prestamo);
    setFormData({
      ...prestamo,
      fechaPrestamo: prestamo.fechaPrestamo.split('T')[0],
      fechaDevolucion: prestamo.fechaDevolucion ? prestamo.fechaDevolucion.split('T')[0] : ""
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      const updatedPrestamos = prestamos.filter(prestamo => prestamo.id !== id);
      setPrestamos(updatedPrestamos);
      localStorage.setItem("prestamos", JSON.stringify(updatedPrestamos));
    }
  };

  const handleReturn = (id) => {
    const updatedPrestamos = prestamos.map(prestamo =>
      prestamo.id === id
        ? { 
            ...prestamo, 
            estado: "devuelto", 
            fechaDevolucion: new Date().toISOString().split('T')[0] 
          }
        : prestamo
    );
    setPrestamos(updatedPrestamos);
    localStorage.setItem("prestamos", JSON.stringify(updatedPrestamos));
  };

  const openModal = () => {
    setEditingLoan(null);
    setFormData({
      usuarioId: "",
      libroId: "",
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucion: "",
      estado: "activo",
      observaciones: ""
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

  const calcularDiasVencidos = (fechaPrestamo, estado) => {
    if (estado === "devuelto") return 0;
    const hoy = new Date();
    const prestamo = new Date(fechaPrestamo);
    const diasLimite = 15; // 15 días de préstamo
    const fechaLimite = new Date(prestamo.getTime() + (diasLimite * 24 * 60 * 60 * 1000));
    const diferencia = Math.ceil((hoy - fechaLimite) / (1000 * 60 * 60 * 24));
    return Math.max(0, diferencia);
  };

  const prestamosActivos = prestamos.filter(p => p.estado === "activo").length;
  const prestamosVencidos = prestamos.filter(p => {
    const diasVencidos = calcularDiasVencidos(p.fechaPrestamo, p.estado);
    return diasVencidos > 0 && p.estado === "activo";
  }).length;

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">📋 Gestión de Préstamos</h1>
              <p className="text-muted">Administra los préstamos de libros</p>
            </div>
            <div className="flex gap-4">
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-warning-600">{prestamosActivos}</div>
                  <div className="text-sm text-muted">Activos</div>
                </div>
              </div>
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-error-600">{prestamosVencidos}</div>
                  <div className="text-sm text-muted">Vencidos</div>
                </div>
              </div>
              <div className="card p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{prestamos.length}</div>
                  <div className="text-sm text-muted">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex gap-4">
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
                <div className="w-48">
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
                <div className="flex items-end">
                  <button onClick={openModal} className="btn btn-primary">
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Libro</th>
                    <th>Fecha Préstamo</th>
                    <th>Días Restantes</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrestamos.map((prestamo) => {
                    const usuario = usuarios.find(u => u.id === prestamo.usuarioId);
                    const libro = libros.find(l => l.id === prestamo.libroId);
                    const diasVencidos = calcularDiasVencidos(prestamo.fechaPrestamo, prestamo.estado);
                    const estado = estadosPrestamo.find(e => e.value === prestamo.estado);
                    
                    return (
                      <tr key={prestamo.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {usuario?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{usuario?.username || 'Usuario eliminado'}</div>
                              <div className="text-xs text-muted">{usuario?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-medium">{libro?.titulo || 'Libro eliminado'}</div>
                            <div className="text-xs text-muted">{libro?.autor}</div>
                          </div>
                        </td>
                        <td>
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}
                        </td>
                        <td>
                          {prestamo.estado === "devuelto" ? (
                            <span className="text-success-600">Devuelto</span>
                          ) : diasVencidos > 0 ? (
                            <span className="text-error-600 font-semibold">
                              {diasVencidos} días vencido
                            </span>
                          ) : (
                            <span className="text-muted">
                              {15 - Math.ceil((new Date() - new Date(prestamo.fechaPrestamo)) / (1000 * 60 * 60 * 24))} días
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium alert-${estado?.color}`}>
                            {estado?.label}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(prestamo)}
                              className="btn btn-secondary"
                              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                            >
                              Editar
                            </button>
                            {prestamo.estado === "activo" && (
                              <button
                                onClick={() => handleReturn(prestamo.id)}
                                className="btn btn-success"
                                style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                              >
                                Devolver
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(prestamo.id)}
                              className="btn btn-danger"
                              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
              <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="usuarioId" className="form-label">Usuario *</label>
                    <select
                      id="usuarioId"
                      name="usuarioId"
                      required
                      value={formData.usuarioId}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.username} ({usuario.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="libroId" className="form-label">Libro *</label>
                    <select
                      id="libroId"
                      name="libroId"
                      required
                      value={formData.libroId}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Seleccionar libro</option>
                      {libros.filter(libro => libro.disponible).map(libro => (
                        <option key={libro.id} value={libro.id}>
                          {libro.titulo} - {libro.autor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaPrestamo" className="form-label">Fecha de Préstamo *</label>
                    <input
                      type="date"
                      id="fechaPrestamo"
                      name="fechaPrestamo"
                      required
                      value={formData.fechaPrestamo}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaDevolucion" className="form-label">Fecha de Devolución</label>
                    <input
                      type="date"
                      id="fechaDevolucion"
                      name="fechaDevolucion"
                      value={formData.fechaDevolucion}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="estado" className="form-label">Estado *</label>
                    <select
                      id="estado"
                      name="estado"
                      required
                      value={formData.estado}
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

                  <div className="form-group">
                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
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