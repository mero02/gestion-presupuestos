import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Select,
  useColorModeValue,
  FormHelperText,
} from '@chakra-ui/react';
import { crearCategoria, actualizarCategoria } from '../../services/api';

const FormularioCategoria = ({ onCategoriaRegistrada, categoriaEditando }) => {
  const [nombre, setNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Color modes
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const helperTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (categoriaEditando) {
      setNombre(categoriaEditando.nombre);
    }
  }, [categoriaEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const categoriaData = { nombre };

      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.id_categoria, categoriaData);
        toast({
          title: 'Categoría actualizada',
          description: 'La categoría fue actualizada exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearCategoria(nombre);
        toast({
          title: 'Categoría registrada',
          description: 'La categoría fue agregada exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onCategoriaRegistrada();
      setNombre('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar/actualizar la categoría.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidNombre = nombre.trim().length >= 3;

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit} 
      width="100%"
    >
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Nombre</FormLabel>
          <Input
            type="text"
            placeholder="Ejemplo: Comida, Transporte, etc."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'outline'
            }}
          />
          <FormHelperText color={helperTextColor}>
            Mínimo 3 caracteres
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          size="lg"
          isLoading={isSubmitting}
          loadingText={categoriaEditando ? "Actualizando..." : "Registrando..."}
          isDisabled={!isValidNombre}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          transition="all 0.2s"
        >
          {categoriaEditando ? 'Actualizar Categoría' : 'Registrar Categoría'}
        </Button>
      </VStack>
    </Box>
  );
};

export default FormularioCategoria;