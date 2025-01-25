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
    console.log('Token en interceptor:', token);
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
  const response = await axios.post(
    'http://127.0.0.1:8000/login',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  localStorage.setItem('token', response.data.access_token); 
  return response;
};


export const crearIngreso = (monto, fuente, id_usuario) => {
  return api.post('/ingresos', 
  { monto, fuente, id_usuario },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const listarIngresos = (idUsuario) => {
  return api.get(`/ingresos/${idUsuario}`);
};

export const crearGasto = (monto, categoria, id_usuario) => {
  return api.post('/gastos', 
  { monto, categoria, id_usuario },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const listarGastos = (idUsuario) => {
  return api.get(`/gastos/${idUsuario}`);
};