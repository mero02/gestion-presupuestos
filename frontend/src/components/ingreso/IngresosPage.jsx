import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import FormularioIngreso from './FormularioIngreso';
import ListaIngresos from './ListaIngresos';
import { useAuth } from '../../context/AuthContext';

const IngresosPage = () => {
  const [actualizarLista, setActualizarLista] = useState(false);
  const { userId } = useAuth();
  const idUsuario = userId;
  const handleIngresoRegistrado = () => {
    setActualizarLista((prev) => !prev); 
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Gestión de Ingresos
      </Heading>
      <FormularioIngreso idUsuario={idUsuario} onIngresoRegistrado={handleIngresoRegistrado} />
      <ListaIngresos idUsuario={idUsuario} key={actualizarLista} />
    </Box>
  );
};

export default IngresosPage;
