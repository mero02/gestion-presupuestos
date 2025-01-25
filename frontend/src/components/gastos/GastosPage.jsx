import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import FormularioGasto from './FormularioGasto';
import ListaGastos from './ListaGastos';
import { useAuth } from '../../context/AuthContext';

const GastosPage = () => {
  const [actualizarLista, setActualizarLista] = useState(false);
  const { userId } = useAuth();
  const idUsuario = userId;
  const handleGastoRegistrado = () => {
    setActualizarLista((prev) => !prev); 
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Gestión de Gastos
      </Heading>
      <FormularioGasto idUsuario={idUsuario} onIngresoRegistrado={handleGastoRegistrado} />
      <ListaGastos idUsuario={idUsuario} key={actualizarLista} />
    </Box>
  );
};

export default GastosPage;
