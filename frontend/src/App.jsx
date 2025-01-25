import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes'; // Importa las rutas

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <AppRoutes /> {/* Aquí utilizamos las rutas modularizadas */}
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
