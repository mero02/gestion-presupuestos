import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import Profile from '../src/components/Profile';
import IngresosPage from '../src/components/ingreso/IngresosPage';
import GastosPage from '../src/components/gastos/GastosPage';
//import ResumenPage from '../src/components/resumen/ResumenPage';
//import PresupuestoPage from '../src/components/presupuesto/PresupuestoPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/ingresospage" 
        element={
          <PrivateRoute>
            <IngresosPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gastospage" 
        element={
          <PrivateRoute>
            <GastosPage />
          </PrivateRoute>
        } 
      />
      {/*<Route 
        path="/resumenpage" 
        element={
          <PrivateRoute>
            <ResumenPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/presupuestopage" 
        element={
          <PrivateRoute>
            <PresupuestoPage />
          </PrivateRoute>
        } 
      />*/}

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Componente PrivateRoute para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default AppRoutes;
