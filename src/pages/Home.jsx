// ===== src/pages/Home.jsx =====
export default function Home() {
  return (
    <div className="bg-gradient-page">
      <div className="container flex items-center justify-center py-20">
        <div className="card animate-slide-up" style={{ maxWidth: '700px', width: '100%' }}>
          <div className="card-body text-center p-8">
            <div className="text-5xl mb-6">📚</div>
            <h1 className="text-3xl font-bold mb-6">Bienvenido a la Biblioteca Digital</h1>
            <p className="text-xl text-muted mb-8 leading-relaxed">
              Gestiona libros, autores, usuarios y préstamos de manera eficiente y moderna.
            </p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="p-6 bg-accent rounded-lg shadow-md">
                <div className="font-semibold text-accent text-lg mb-2">📖 Catálogo</div>
                <div className="text-muted">Organiza tu colección</div>
              </div>
              <div className="p-6 bg-accent rounded-lg shadow-md">
                <div className="font-semibold text-accent text-lg mb-2">👥 Usuarios</div>
                <div className="text-muted">Gestión completa</div>
              </div>
              <div className="p-6 bg-accent rounded-lg shadow-md">
                <div className="font-semibold text-accent text-lg mb-2">📋 Préstamos</div>
                <div className="text-muted">Control de inventario</div>
              </div>
              <div className="p-6 bg-accent rounded-lg shadow-md">
                <div className="font-semibold text-accent text-lg mb-2">✍️ Autores</div>
                <div className="text-muted">Base de datos completa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}