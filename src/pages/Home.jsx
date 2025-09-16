// src/pages/Home.jsx
import "./Home.css"; // 👈 Import del CSS
export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🏠 Inicio Público</h1>
        <p>Bienvenido a nuestra aplicación. Aquí puedes registrarte, iniciar sesión o recuperar tu contraseña.</p>
      </div>
    </div>
  );
}
