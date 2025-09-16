// ===== src/pages/Home.jsx =====
export default function Home() {
  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container flex items-center justify-center py-16">
        <div className="card animate-slide-up" style={{ maxWidth: '600px' }}>
          <div className="card-body text-center">
            <div className="text-4xl mb-4">📚</div>
            <h1 className="text-2xl font-bold mb-4">Bienvenido a la Biblioteca Digital</h1>
            <p className="text-lg text-muted mb-6">
              Gestiona libros, autores, usuarios y préstamos de manera eficiente y moderna.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-accent rounded-lg">
                <div className="font-semibold text-accent">📖 Catálogo</div>
                <div className="text-muted">Organiza tu colección</div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <div className="font-semibold text-accent">👥 Usuarios</div>
                <div className="text-muted">Gestión completa</div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <div className="font-semibold text-accent">📋 Préstamos</div>
                <div className="text-muted">Control de inventario</div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <div className="font-semibold text-accent">✍️ Autores</div>
                <div className="text-muted">Base de datos completa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}