// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import ThemeToggle from "../components/ThemeToggle";
import { validateEmail } from "../utils/validators";
import { emailExists } from "../utils/userHelpers";
import EmailJSConfig from "../components/EmailJSConfig";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [isEmailJSConfigured, setIsEmailJSConfigured] = useState(false);
  const { loading, error, success, requestPasswordReset, clearMessages } = useAuth();

  React.useEffect(() => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const configured =
      serviceId &&
      templateId &&
      publicKey &&
      serviceId !== "tu-service-id" &&
      templateId !== "tu-template-id" &&
      publicKey !== "tu-public-key";

    setIsEmailJSConfigured(configured);
  }, []);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
    clearMessages();

    if (newEmail && !validateEmail(newEmail).isValid) {
      setEmailError(validateEmail(newEmail).message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    clearMessages();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      return;
    }

    if (!emailExists(email)) {
      setEmailError(
        "No existe una cuenta asociada a este correo electrónico. ¿Necesitas registrarte?"
      );
      return;
    }

    try {
      await requestPasswordReset(email);
    } catch (err) {
      console.error("Error en recuperación de contraseña:", err);
    }
  };

  return (
    <div className="bg-gradient-page">

      <div className="container">
        <div className="auth-layout">
          {/* Formulario a la izquierda */}
          <div className="auth-form">
            <div className="auth-card">
              <h2 className="text-2xl font-bold mb-2 text-gradient text-center">
                Recuperar Contraseña
              </h2>
              <p className="auth-subtitle text-center">
                Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
              </p>

              {/* Indicadores de seguridad */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-green-500">✓</span>
                  <span>Encriptado SSL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-green-500">✓</span>
                  <span>Verificación segura</span>
                </div>
              </div>

              {!isEmailJSConfigured && (
                <div className="alert alert-warning animate-slide-down">
                  <span>⚠️ EmailJS no está configurado. Se usará modo simulación.</span>
                  <button
                    type="button"
                    onClick={() => setShowConfig(!showConfig)}
                    className="btn btn-secondary"
                  >
                    {showConfig ? "Ocultar" : "Configurar"}
                  </button>
                </div>
              )}

              {showConfig && (
                <EmailJSConfig
                  onConfigComplete={(configured) => {
                    setIsEmailJSConfigured(configured);
                    if (configured) {
                      setShowConfig(false);
                    }
                  }}
                />
              )}

              {/* Mensajes */}
              <MessageAlert type="error" message={error} onClose={clearMessages} />
              <MessageAlert type="success" message={success} onClose={clearMessages} />
              <MessageAlert type="error" message={emailError} />

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="tu.email@ejemplo.com"
                    disabled={loading}
                    className={`form-input ${emailError ? 'input-error' : ''}`}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !email || emailError}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner small /> Enviando...
                    </>
                  ) : (
                    "Enviar Código de Recuperación"
                  )}
                </button>
              </form>

              <div className="auth-links">
                <p>
                  ¿Ya tienes un código? <Link to="/resetpassword">Restablecer contraseña</Link>
                </p>
                <p>
                  <Link to="/login">Volver al inicio de sesión</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Collage de imágenes a la derecha */}
          <div className="auth-carousel">
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop"
                  alt="Seguridad digital"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop"
                  alt="Protección de datos"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=300&h=200&fit=crop"
                  alt="Seguridad digital"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop"
                  alt="Verificación segura"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
