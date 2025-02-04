import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, HStack, useToast, Menu, MenuButton, MenuList, MenuItem, IconButton, Heading } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      status: 'success',
      duration: 2000,
    });
    navigate('/login');
  };

  const renderAuthButton = () => {
    if (user) return null;
    
    const isLoginPage = location.pathname === '/login';
    
    return (
      <Button
        as={RouterLink}
        to={isLoginPage ? '/register' : '/login'}
        bg={"orange.400"}
        _hover={{
          bg: "orange.500",
          transform: 'scale(1.05)',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '2xl'
        }}
        _active={{
          bg: "orange.600",
          transform: 'scale(0.95)'
        }}
      >
        {isLoginPage ? 'Registro' : 'Iniciar Sesión'}
      </Button>
    );
  };

  return (
    <Box as="nav" bg="gray.900" p={4} display="flex" alignItems="center">
      <Heading as="h1" size="xl" color="white" flexGrow={1} textAlign="center">
        Gestor de Presupuestos
      </Heading>

      <HStack spacing={4}>
        {renderAuthButton()}
        {user && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Opciones"
              icon={<HiMenu />}
              variant="outline"
              colorScheme="orange"
            />
            <MenuList>
              <MenuItem as={RouterLink} to="/profile">
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout} color="red.500">
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Box>
  );
};

export default Navigation;