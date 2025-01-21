import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, HStack, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box as="nav" bg="gray.100" p={4}>
      <HStack spacing={4} justify="flex-end">
        {!user ? (
          <>
            <Button as={RouterLink} to="/register" colorScheme="blue">
              Registro
            </Button>
            <Button as={RouterLink} to="/login" colorScheme="green">
              Iniciar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button as={RouterLink} to="/profile" colorScheme="blue">
              Mi Perfil
            </Button>
            <Button onClick={handleLogout} colorScheme="red">
              Cerrar Sesión
            </Button>
          </>
        )}
      </HStack>
    </Box>
  );
};

export default Navigation;