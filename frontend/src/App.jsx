import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

// PrivateRoute component para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default App;