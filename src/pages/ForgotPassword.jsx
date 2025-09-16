// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import { validateEmail } from "../utils/validators";
import { emailExists } from "../utils/userHelpers";
import EmailJSConfig from "../components/EmailJSConfig";
import "./ForgotPassword.css"; // 👈 Import del CSS

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
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>🔐 Recuperar Contraseña</h1>
        <p>
          Ingresa tu correo electrónico y te enviaremos un código para restablecer tu
          contraseña.
        </p>

        {!isEmailJSConfigured && (
          <div className="alert-config">
            <span>⚠️</span>
            <span>EmailJS no está configurado. Se usará modo simulación.</span>
            <button type="button" onClick={() => setShowConfig(!showConfig)}>
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

        <MessageAlert type="error" message={error} onClose={clearMessages} />
        <MessageAlert type="success" message={success} onClose={clearMessages} />
        <MessageAlert type="error" message={emailError} />

        <form onSubmit={handleSubmit} className="forgot-form">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={handleEmailChange}
            placeholder="tu.email@ejemplo.com"
            disabled={loading}
          />

          <button type="submit" disabled={loading || !email || emailError}>
            {loading ? (
              <>
                <LoadingSpinner small /> Enviando...
              </>
            ) : (
              "Enviar Código de Recuperación"
            )}
          </button>
        </form>

        <div className="forgot-links">
          <p>
            ¿Ya tienes un código? <Link to="/resetPassword">Restablecer contraseña</Link>
          </p>
          <p>
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
