// ===== src/pages/Home.jsx =====
export default function Home() {
  return (
    <div className="bg-gradient-page">
      <div className="container">
        <div className="card animate-slide-up" style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold mb-8">Bienvenido a la Biblioteca Digital</h1>
            <p className="text-xl text-muted mb-10 leading-relaxed max-w-2xl mx-auto">
              Gestiona libros, autores, usuarios y préstamos de manera eficiente y moderna.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm max-w-4xl mx-auto">
              <div className="p-8 bg-accent rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="font-semibold text-accent text-xl mb-3">Catálogo</div>
                <div className="text-muted text-base">Organiza tu colección</div>
              </div>
              <div className="p-8 bg-accent rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="font-semibold text-accent text-xl mb-3">Usuarios</div>
                <div className="text-muted text-base">Gestión completa</div>
              </div>
              <div className="p-8 bg-accent rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="font-semibold text-accent text-xl mb-3">Préstamos</div>
                <div className="text-muted text-base">Control de inventario</div>
              </div>
              <div className="p-8 bg-accent rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="font-semibold text-accent text-xl mb-3">Autores</div>
                <div className="text-muted text-base">Base de datos completa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}