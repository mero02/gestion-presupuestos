import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Ajusta según tu configuración

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejar tokens de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Obtén el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token a las cabeceras
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Si el token es inválido o expiró, redirige al login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Servicios para Usuarios
export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
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

// Servicios para Ingresos
export const crearIngreso = (monto, fuente,id_usuario, id_moneda ) => {
  return api.post('/ingresos', 
  { monto, fuente, id_usuario, id_moneda },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const listarIngresos = (idUsuario) => {
  return api.get(`/ingresos/${idUsuario}`);
};

export const eliminarIngreso = async (idIngreso) => {
  const response = await api.delete(`/ingresos/${idIngreso}`);
  return response.data;
};

export const actualizarIngreso = async (idIngreso, ingresoData) => {
  const response = await api.put(`/ingresos/${idIngreso}`, ingresoData);
  return response.data;
};

// servicios para gastos
export const crearGasto = (monto, id_categoria, id_usuario) => {
  return api.post('/gastos', { monto, id_categoria, id_usuario }, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const listarGastos = (idUsuario) => {
  return api.get(`/gastos/${idUsuario}`);
};

export const eliminarGasto = async (idGasto) => {
  const response = await api.delete(`/gastos/${idGasto}`);
  return response.data;
};

export const actualizarGasto = async (idGasto, gastoData) => {
  const response = await api.put(`/gastos/${idGasto}`, gastoData);
  return response.data;
}

// Servicios para Categorías
export const obtenerCategoria = async (idCategoria) => {
  const response = await api.get(`/categorias/${idCategoria}`);
  return response.data;
};

export const crearCategoria = async (nombre) => {
  const response = await api.post('/categorias', { nombre });
  return response.data;
};

export const obtenerCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

export const actualizarCategoria = async (idCategoria, categoriaData) => {
  const response = await api.put(`/categorias/${idCategoria}`, categoriaData);
  return response.data;
};

export const eliminarCategoria = async (idCategoria) => {
  const response = await api.delete(`/categorias/${idCategoria}`);
  return response.data;
};



// Servicios para Resumen
export const obtenerResumen = async (userId, mes, año) => {
  const response = await api.get(`/resumen/${userId}/${mes}/${año}`);
  return response.data;
};

// Servicios para Monedas
export const obtenerMoneda = async (idMoneda) => {
  const response = await api.get(`/monedas/${idMoneda}`);
  return response.data;
};

export const crearMoneda = async (nombre) => {
  const response = await api.post('/monedas', { nombre });
  return response.data;
};

export const obtenerMonedas = async () => {
  const response = await api.get('/monedas');
  return response.data;
};

export const actualizarMoneda = async (idMoneda, monedaData) => {
  const response = await api.put(`/monedas/${idMoneda}`, monedaData);
  return response.data;
};

export const eliminarMoneda = async (idMoneda) => {
  const response = await api.delete(`/monedas/${idMoneda}`);
  return response.data;
};

// Servicios para presupuestos
export const crearPresupuesto = async (id_usuario, id_categoria, id_moneda, monto_objetivo, periodo, fecha_inicio, fecha_fin) => {
  const body = {
    id_usuario,
    id_categoria,
    id_moneda,
    monto_objetivo,
    periodo,
    fecha_inicio,
    fecha_fin,
  };
  return api.post('/presupuestos', body, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const listarPresupuestos = async (idUsuario) => {
  const response = await api.get(`/presupuestos/${idUsuario}`);
  return response.data;
};

export const obtenerPresupuesto = async (idPresupuesto) => {
  const response = await api.get(`/presupuestos/detalle/${idPresupuesto}`);
  return response.data;
};

export const actualizarPresupuesto = async (idPresupuesto, presupuestoData) => {
  const response = await api.put(`/presupuestos/${idPresupuesto}`, presupuestoData);
  return response.data;
};

export const eliminarPresupuesto = async (idPresupuesto) => {
  const response = await api.delete(`/presupuestos/${idPresupuesto}`);
  return response.data;
};

export const actualizarMontoPresupuesto = async (idPresupuesto) => {
  const response = await api.put(`/presupuestos/${idPresupuesto}/actualizar-monto`);
  return response.data;
};