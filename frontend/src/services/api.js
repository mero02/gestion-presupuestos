import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Ajusta según tu configuración

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => {
  return api.post('/register', userData);
};

export const login = async (email, password) => {
  return axios.post(
    'http://127.0.0.1:8000/login',
    { email, password }, // Enviar los datos como JSON en el cuerpo
    {
      headers: {
        'Content-Type': 'application/json', // Especificar el tipo de contenido
      },
    }
  );
};

export const getProfile = () => {
  return api.get('/usuarios/me');
};