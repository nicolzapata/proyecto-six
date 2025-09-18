// src/utils/validators.js
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  return { isValid: true };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { isValid: true };
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden' };
  }

  return { isValid: true };
};

export const validateResetCode = (code) => {
  if (!code) {
    return { isValid: false, error: 'El código es requerido' };
  }

  if (code.length !== 6) {
    return { isValid: false, error: 'El código debe tener 6 dígitos' };
  }

  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, error: 'El código solo debe contener números' };
  }

  return { isValid: true };
};

export const validateISBN = (isbn) => {
  if (!isbn) {
    return { isValid: true }; // ISBN es opcional
  }

  // Remover guiones y espacios
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  // Validar formato básico
  if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
    return { isValid: false, error: 'Formato ISBN inválido (debe ser 10 o 13 dígitos)' };
  }

  // Validación de checksum para ISBN-10
  if (cleanISBN.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanISBN[i]) * (10 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 11;
    const expectedCheck = checkDigit === 10 ? 'X' : checkDigit.toString();
    if (cleanISBN[9] !== expectedCheck) {
      return { isValid: false, error: 'Dígito de control ISBN-10 inválido' };
    }
  }

  // Validación básica para ISBN-13 (más compleja, por ahora solo formato)
  if (cleanISBN.length === 13) {
    // Aquí se podría implementar validación completa de ISBN-13
    // Por simplicidad, solo validamos que empiece con 978 o 979
    if (!cleanISBN.startsWith('978') && !cleanISBN.startsWith('979')) {
      return { isValid: false, error: 'ISBN-13 debe comenzar con 978 o 979' };
    }
  }

  return { isValid: true };
};

export const validateFechaPublicacion = (fecha) => {
  if (!fecha) {
    return { isValid: true }; // Fecha es opcional
  }

  const fechaObj = new Date(fecha);
  const hoy = new Date();

  if (isNaN(fechaObj.getTime())) {
    return { isValid: false, error: 'Fecha inválida' };
  }

  if (fechaObj > hoy) {
    return { isValid: false, error: 'La fecha de publicación no puede ser futura' };
  }

  // No permitir fechas anteriores a 1450 (inventó de la imprenta)
  const fechaMinima = new Date('1450-01-01');
  if (fechaObj < fechaMinima) {
    return { isValid: false, error: 'La fecha de publicación parece demasiado antigua' };
  }

  return { isValid: true };
};

export const validateFechaPrestamo = (fecha) => {
  if (!fecha) {
    return { isValid: false, error: 'La fecha de préstamo es requerida' };
  }

  const fechaObj = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (isNaN(fechaObj.getTime())) {
    return { isValid: false, error: 'Fecha inválida' };
  }

  if (fechaObj > hoy) {
    return { isValid: false, error: 'La fecha de préstamo no puede ser futura' };
  }

  return { isValid: true };
};

export const validateFechaDevolucion = (fechaPrestamo, fechaDevolucion) => {
  if (!fechaDevolucion) {
    return { isValid: true }; // Fecha de devolución es opcional
  }

  const prestamoObj = new Date(fechaPrestamo);
  const devolucionObj = new Date(fechaDevolucion);

  if (isNaN(devolucionObj.getTime())) {
    return { isValid: false, error: 'Fecha de devolución inválida' };
  }

  if (devolucionObj < prestamoObj) {
    return { isValid: false, error: 'La fecha de devolución no puede ser anterior al préstamo' };
  }

  return { isValid: true };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  return { isValid: true };
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return { isValid: false, error: `${fieldName} debe tener al menos ${minLength} caracteres` };
  }
  return { isValid: true };
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} no puede tener más de ${maxLength} caracteres` };
  }
  return { isValid: true };
};

export const validateTelefono = (telefono) => {
  if (!telefono) {
    return { isValid: true }; // Teléfono es opcional
  }

  // Remover espacios, guiones y paréntesis
  const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '');

  // Validar que solo contenga números y opcionalmente +
  if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Formato de teléfono inválido' };
  }

  return { isValid: true };
};

export const validateIdentificacion = (identificacion, tipo) => {
  if (!identificacion) {
    return { isValid: false, error: 'La identificación es requerida' };
  }

  // Remover espacios y puntos
  const cleanId = identificacion.replace(/[\s\.]/g, '');

  switch (tipo) {
    case 'Cédula de Ciudadanía':
      if (!/^\d{8,10}$/.test(cleanId)) {
        return { isValid: false, error: 'Cédula de ciudadanía debe tener 8-10 dígitos' };
      }
      break;
    case 'Tarjeta de Identidad':
      if (!/^\d{10,11}$/.test(cleanId)) {
        return { isValid: false, error: 'Tarjeta de identidad debe tener 10-11 dígitos' };
      }
      break;
    case 'Cédula de Extranjería':
      if (!/^\d{6,12}$/.test(cleanId)) {
        return { isValid: false, error: 'Cédula de extranjería debe tener 6-12 dígitos' };
      }
      break;
    case 'Pasaporte':
      if (!/^[A-Z0-9]{6,12}$/i.test(cleanId)) {
        return { isValid: false, error: 'Pasaporte debe tener 6-12 caracteres alfanuméricos' };
      }
      break;
    default:
      if (cleanId.length < 5) {
        return { isValid: false, error: 'Identificación debe tener al menos 5 caracteres' };
      }
  }

  return { isValid: true };
};