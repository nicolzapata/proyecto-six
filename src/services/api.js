const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok || data.error) {
    console.error('Error en respuesta:', response.status, data);
    throw new Error(data.message || data.error || 'Error en la petición');
  }
  return data;
};

// Helper para obtener headers con credenciales
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// Helper para requests con credenciales de sesión
const authenticatedFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Importante: incluye cookies de sesión
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para sesiones
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

export const booksAPI = {
  getAll: async (params = '') => {
    const response = await fetch(`${API_URL}/books${params}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },

  create: async (bookData) => {
    const response = await authenticatedFetch(`${API_URL}/books`, {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  },

  update: async (id, bookData) => {
    const response = await authenticatedFetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/books/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  getGenres: async () => {
    const response = await fetch(`${API_URL}/books/genres`, {
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

export const authorsAPI = {
  getAll: async (params = '') => {
    const response = await fetch(`${API_URL}/authors${params}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/authors/${id}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },

  create: async (authorData) => {
    const response = await authenticatedFetch(`${API_URL}/authors`, {
      method: 'POST',
      body: JSON.stringify(authorData)
    });
    return handleResponse(response);
  },

  update: async (id, authorData) => {
    const response = await authenticatedFetch(`${API_URL}/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/authors/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

export const usersAPI = {
  getAll: async (params = '') => {
    const response = await authenticatedFetch(`${API_URL}/users${params}`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/users/${id}`);
    return handleResponse(response);
  },

  update: async (id, userData) => {
    const response = await authenticatedFetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  changeRole: async (id, role) => {
    const response = await authenticatedFetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
    return handleResponse(response);
  },

  toggleStatus: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/users/${id}/toggle-status`, {
      method: 'PATCH'
    });
    return handleResponse(response);
  }
};

export const loansAPI = {
  getAll: async (params = '') => {
    console.log('DEBUG: loansAPI.getAll called with params:', params);
    const response = await authenticatedFetch(`${API_URL}/loans${params}`);
    const result = await handleResponse(response);
    console.log('DEBUG: loansAPI.getAll response:', result);
    return result;
  },

  getById: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/loans/${id}`);
    return handleResponse(response);
  },

  create: async (loanData) => {
    const response = await authenticatedFetch(`${API_URL}/loans`, {
      method: 'POST',
      body: JSON.stringify(loanData)
    });
    return handleResponse(response);
  },

  update: async (id, loanData) => {
    const response = await authenticatedFetch(`${API_URL}/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(loanData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/loans/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  returnBook: async (id) => {
    const response = await authenticatedFetch(`${API_URL}/loans/${id}/return`, {
      method: 'PATCH'
    });
    return handleResponse(response);
  },

  renewLoan: async (id, newDueDate) => {
    const response = await authenticatedFetch(`${API_URL}/loans/${id}/renew`, {
      method: 'PATCH',
      body: JSON.stringify({ newDueDate })
    });
    return handleResponse(response);
  },

  getUserLoans: async (userId) => {
    const response = await authenticatedFetch(`${API_URL}/loans/user/${userId}`);
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await authenticatedFetch(`${API_URL}/loans/stats`);
    return handleResponse(response);
  }
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await authenticatedFetch(`${API_URL}/dashboard/stats`);
    return handleResponse(response);
  },

  getRecentLoans: async () => {
    const response = await authenticatedFetch(`${API_URL}/dashboard/recent-loans`);
    return handleResponse(response);
  },

  getLowStockBooks: async () => {
    const response = await authenticatedFetch(`${API_URL}/dashboard/low-stock`);
    return handleResponse(response);
  }
};