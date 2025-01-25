import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { crearGasto } from '../../services/api'; // Asegúrate de implementar esta función en tu servicio API

const FormularioGasto = ({ idUsuario, onGastoRegistrado }) => {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gastoData = {
        monto: parseFloat(monto),
        categoria,
        id_usuario: idUsuario,
      };
      await crearGasto(gastoData.monto, gastoData.categoria, gastoData.id_usuario);
      toast({
        title: 'Gasto registrado',
        description: 'El gasto fue agregado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onGastoRegistrado(); 
      setMonto('');
      setCategoria('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar el gasto.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
      <FormControl mb={4} isRequired>
        <FormLabel>Monto</FormLabel>
        <Input
          type="number"
          placeholder="Ingresa el monto del gasto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Categoría</FormLabel>
        <Input
          type="text"
          placeholder="Ejemplo: Alquiler, Comida, etc."
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </FormControl>
      <Button type="submit" colorScheme="red" width="full">
        Registrar Gasto
      </Button>
    </Box>
  );
};

export default FormularioGasto;
