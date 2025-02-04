import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, useColorModeValue, } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials.email, credentials.password);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token); // Almacenar el token con una clave genérica
  
        const decodedToken = jwt_decode(response.data.access_token);
        const userId = decodedToken.user_id || decodedToken.sub;
        const userName = decodedToken.user_name || decodedToken.name;
        toast({
          title: 'Inicio de sesión exitoso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
  
        authLogin({ email: credentials.email }, response.data.access_token, userId, userName);
        navigate(`/profile`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error en el inicio de sesión',
        description: error.response?.data?.detail || 'Credenciales inválidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box maxW="md" mx="auto" bg={bgColor} py={8}>
      <VStack spacing={6} bg={"gray.700"} p={8} borderRadius={5}>
        <Heading>Iniciar Sesión</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </FormControl>
            <Button 
              type="submit" 
              width="full"
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
              Iniciar Sesión
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Login;