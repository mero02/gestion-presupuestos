import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { crearIngreso } from '../../services/api';

const FormularioIngreso = ({ idUsuario, onIngresoRegistrado }) => {
  const [monto, setMonto] = useState('');
  const [fuente, setFuente] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ingresoData = {
        monto: parseFloat(monto),
        fuente,
        id_usuario: idUsuario,
      };
      await crearIngreso(ingresoData.monto, ingresoData.fuente, ingresoData.id_usuario);
      toast({
        title: 'Ingreso registrado',
        description: 'El ingreso fue agregado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onIngresoRegistrado();
      setMonto('');
      setFuente('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar el ingreso.',
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
          placeholder="Ingresa el monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Fuente</FormLabel>
        <Input
          type="text"
          placeholder="Ejemplo: Sueldo, Venta, etc."
          value={fuente}
          onChange={(e) => setFuente(e.target.value)}
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" width="full">
        Registrar Ingreso
      </Button>
    </Box>
  );
};

export default FormularioIngreso;
