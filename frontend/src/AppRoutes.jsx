import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import Profile from '../src/components/Profile';
import IngresosPage from '../src/components/ingreso/IngresosPage';
import GastosPage from '../src/components/gastos/GastosPage';
import ResumenPage from '../src/components/resumen/ResumenPage';
import CategoriaPage from '../src/components/categoria/CategoriaPage';
import MonedasPage from './components/monedas/MonedasPage';
import PresupuestosPage from '../src/components/presupuesto/PresupuestosPage';

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
      <Route 
        path="/resumenpage" 
        element={
          <PrivateRoute>
            <ResumenPage />
          </PrivateRoute>
        } 
      />
      <Route
        path="/categoriapage"
        element={
          <PrivateRoute>
            <CategoriaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/monedapage"
        element={
          <PrivateRoute>
            <MonedasPage />
          </PrivateRoute>
        }
      />
      <Route 
        path="/presupuestospage" 
        element={
          <PrivateRoute>
            <PresupuestosPage />
          </PrivateRoute>
        } 
      />

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
