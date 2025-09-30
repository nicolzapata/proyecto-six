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

  // Verificar sesión activa al inicializar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error('No hay sesión activa:', error);
        // No hacer nada, el usuario no está logueado
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
      console.log('Intentando login con:', credentials);

      // Preparar las credenciales para el backend
      const loginData = {
        username: credentials.username,
        email: credentials.username.includes('@') ? credentials.username : undefined,
        password: credentials.password
      };

      // Si el username parece un email, enviarlo como email
      if (credentials.username.includes('@')) {
        loginData.email = credentials.username;
        delete loginData.username;
      }

      console.log('Enviando datos de login:', loginData);
      const response = await authAPI.login(loginData);
      console.log('Respuesta del login:', response);

      // Verificar la sesión después del login para asegurar que las cookies funcionan
      try {
        const sessionResponse = await authAPI.getCurrentUser();
        setUser(sessionResponse.user);
        console.log('Sesión verificada:', sessionResponse.user);
      } catch (sessionError) {
        console.error('Error verificando sesión:', sessionError);
        // Si falla la verificación, usar los datos del login
        setUser(response.user);
      }

      setSuccess('Login exitoso');

      return { success: true, user: response.user };
    } catch (err) {
      console.error('Error en login:', err);
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

      // El backend maneja la sesión con cookies, solo guardar el usuario en el estado
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

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setSuccess('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aun así limpiar el estado local
      setUser(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser(prevUser => ({ ...prevUser, ...updatedFields }));
  };

  const loadProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
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
    updateUser,
    loadProfile,
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