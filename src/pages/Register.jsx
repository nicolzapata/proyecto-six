// ===== src/pages/Register.jsx =====
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "../components/Carousel";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = existingUsers.some(
      user =>
        user.username === formData.username || user.email === formData.email
    );

    if (userExists) {
      setError("El nombre de usuario o email ya está registrado");
      setIsLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString(),
      role: "user"
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setSuccess("¡Registro exitoso! Redirigiendo al login...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="bg-gradient-page min-h-screen">
      <div className="container py-8">
        <div className="auth-layout">
          {/* Carrusel de imágenes */}
          <div className="auth-carousel">
            <Carousel />
          </div>

          {/* Formulario de registro */}
          <div className="auth-form">
            <div className="card w-full max-w-md">
              <div className="card-body">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    📝 Crear Nueva Cuenta
                  </h1>
                  <p className="text-muted">Únete a nuestra biblioteca digital</p>
                </div>

                {error && (
                  <div className="alert alert-error animate-slide-down">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success animate-slide-down">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Tu nombre de usuario"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="tu.email@ejemplo.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Mínimo 6 caracteres"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Repite tu contraseña"
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-accent font-medium hover:underline">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;