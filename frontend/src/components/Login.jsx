import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast } from '@chakra-ui/react';
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
        const tokenKey = `token_${credentials.email}`;
        localStorage.setItem('token', response.data.access_token); // Almacenar el token con una clave genérica
  
        const decodedToken = jwt_decode(response.data.access_token);
        const userId = decodedToken.user_id || decodedToken.sub;
  
        toast({
          title: 'Inicio de sesión exitoso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
  
        authLogin({ email: credentials.email }, response.data.access_token, userId);
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

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={4}>
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
            <Button type="submit" colorScheme="blue" width="full">
              Iniciar Sesión
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Login;