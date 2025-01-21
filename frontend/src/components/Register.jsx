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
import { register } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast({
        title: 'Registro exitoso',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error en el registro',
        description: error.response?.data?.detail || 'Ocurrió un error',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={4}>
        <Heading>Registro</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Registrarse
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Register;