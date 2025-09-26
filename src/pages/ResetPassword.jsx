// src/pages/ResetPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import ThemeToggle from "../components/ThemeToggle";
import { validateEmail, validatePassword, validatePasswordMatch, validateResetCode } from "../utils/validators";
import "../styles/components/login-register.css";
import "../styles/pages/collage.css";


const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { loading, error, success, resetPassword, clearMessages } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validación en tiempo real
    const newErrors = { ...validationErrors };

    switch (name) {
      case 'email':
        const emailValidation = validateEmail(value);
        if (emailValidation.isValid) {
          delete newErrors.email;
        } else {
          newErrors.email = emailValidation.error;
        }
        break;
      case 'code':
        const codeValidation = validateResetCode(value);
        if (codeValidation.isValid) {
          delete newErrors.code;
        } else {
          newErrors.code = codeValidation.error;
        }
        break;
      case 'newPassword':
        const passwordValidation = validatePassword(value);
        if (passwordValidation.isValid) {
          delete newErrors.newPassword;
        } else {
          newErrors.newPassword = passwordValidation.error;
        }
        // Revalidar confirmación si existe
        if (formData.confirmPassword) {
          const matchValidation = validatePasswordMatch(value, formData.confirmPassword);
          if (matchValidation.isValid) {
            delete newErrors.confirmPassword;
          } else {
            newErrors.confirmPassword = matchValidation.error;
          }
        }
        break;
      case 'confirmPassword':
        const matchValidation = validatePasswordMatch(formData.newPassword, value);
        if (matchValidation.isValid) {
          delete newErrors.confirmPassword;
        } else {
          newErrors.confirmPassword = matchValidation.error;
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    // Validar todos los campos
    const errors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;

    const codeValidation = validateResetCode(formData.code);
    if (!codeValidation.isValid) errors.code = codeValidation.error;

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) errors.newPassword = passwordValidation.error;

    const matchValidation = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
    if (!matchValidation.isValid) errors.confirmPassword = matchValidation.error;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await resetPassword(formData.email, formData.code, formData.newPassword);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isFormValid = formData.email && formData.code && formData.newPassword && formData.confirmPassword && !hasValidationErrors;

  return (
    <div className="bg-gradient-page">
      <div className="container">
        <div className="flex justify-center items-center min-h-screen py-8">
          <div className="auth-form max-w-lg w-full">
            <div className="card">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gradient">
                  Restablecer Contraseña
                </h2>
                <p className="auth-subtitle">
                  Ingresa el código que recibiste por email y tu nueva contraseña
                </p>
              </div>

              {/* Indicadores de progreso */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-muted">Código</span>
                </div>
                <div className="w-8 h-px bg-muted"></div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
                  <span className="font-medium">Nueva contraseña</span>
                </div>
                <div className="w-8 h-px bg-muted"></div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span className="text-muted">Completado</span>
                </div>
              </div>

              {/* Mensajes */}
              <MessageAlert type="error" message={error} onClose={clearMessages} />
              <MessageAlert type="success" message={success} onClose={clearMessages} />

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.email@ejemplo.com"
                    disabled={loading}
                    className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                  />
                  <MessageAlert type="error" message={validationErrors.email} />
                </div>

                <div className="form-group">
                  <label htmlFor="code" className="form-label">Código de recuperación</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ingresa el código de 6 dígitos"
                    disabled={loading}
                    maxLength="6"
                    className={`form-input ${validationErrors.code ? 'input-error' : ''}`}
                  />
                  <MessageAlert type="error" message={validationErrors.code} />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    minLength="6"
                    className={`form-input ${validationErrors.newPassword ? 'input-error' : ''}`}
                  />
                  <MessageAlert type="error" message={validationErrors.newPassword} />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    minLength="6"
                    className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                  />
                  <MessageAlert type="error" message={validationErrors.confirmPassword} />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner small /> Restableciendo...
                    </>
                  ) : (
                    "Restablecer contraseña"
                  )}
                </button>
              </form>

              <div className="auth-links">
                <p>
                  ¿No tienes un código? <Link to="/forgotpassword">Solicitar código</Link>
                </p>
                <p>
                  <Link to="/login">Volver al inicio de sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;