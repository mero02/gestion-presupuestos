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
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { register } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box maxW="md" mx="auto" bg={bgColor} py={8}>
      <VStack spacing={4} bg={"gray.700"} p={8} borderRadius={5}>
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
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  borderColor="#00CED1"
                  color="white"
                  minLength={8}
                  _hover={{ borderColor: "#4169E1" }}
                  _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    color="#00CED1"
                    _hover={{ bg: 'transparent', color: "#4169E1" }}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  />
                </InputRightElement>
              </InputGroup>
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
              Registrarse
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Register;