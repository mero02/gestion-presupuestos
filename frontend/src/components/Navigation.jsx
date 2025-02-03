import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, HStack, useToast, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi'; // Ícono de hamburguesa de react-icons
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      status: 'success',
      duration: 2000,
    });
    navigate('/login');
  };

  return (
    <Box as="nav" bg="gray.900" p={4}>
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
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Opciones"
                icon={<HiMenu />} // Ícono de hamburguesa de react-icons
                variant="outline"
                colorScheme="blue"
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
          </>
        )}
      </HStack>
    </Box>
  );
};

export default Navigation;