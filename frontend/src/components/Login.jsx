import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      authLogin(response.data);
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error en el inicio de sesión',
        description: error.response?.data?.detail || 'Credenciales inválidas',
        status: 'error',
        duration: 3000,
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
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
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