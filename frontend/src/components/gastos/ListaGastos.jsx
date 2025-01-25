import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner } from '@chakra-ui/react';
import { listarGastos } from '../../services/api';

const ListaGastos = ({ idUsuario }) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        setLoading(true);
        const response = await listarGastos(idUsuario);
        setGastos(response.data);
      } catch (error) {
        console.error('Error al obtener los gastos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [idUsuario]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Lista de gastos
      </Heading>
      <VStack align="stretch">
        {gastos.length > 0 ? (
          gastos.map((gasto) => (
            <Box
              key={gasto.id_gasto}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text><strong>Categoria:</strong> {gasto.categoria}</Text>
              <Text><strong>Monto:</strong> ${gasto.monto.toFixed(2)}</Text>
              <Text><strong>Fecha:</strong> {new Date(gasto.fecha).toLocaleString()}</Text>
            </Box>
          ))
        ) : (
          <Text>No hay gastos registrados.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default ListaGastos;
