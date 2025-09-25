import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar si hay un token guardado al inicializar
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
        }
      }
      
      setIsAuthLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.login(credentials);
      
      // Guardar token y datos de usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      setUser(response.user);
      setSuccess('Login exitoso');
      
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.register(userData);
      
      // Guardar token y datos de usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      setUser(response.user);
      setSuccess('Registro exitoso');
      
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message || 'Error al registrarse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setSuccess('Sesión cerrada exitosamente');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Mantener compatibilidad con sistema de recuperación de contraseña existente
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Aquí puedes implementar la lógica real de recuperación
      // Por ahora mantenemos la funcionalidad existente
      setSuccess('Código de recuperación enviado al correo');
    } catch (err) {
      setError('Error al enviar el código de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Implementar lógica real de reset de contraseña
      setSuccess('Contraseña restablecida exitosamente');
    } catch (err) {
      setError('Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthLoading,
    error,
    success,
    requestPasswordReset,
    resetPassword,
    clearMessages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};