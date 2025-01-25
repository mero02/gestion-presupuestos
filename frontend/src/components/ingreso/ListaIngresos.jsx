import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner } from '@chakra-ui/react';
import { listarIngresos } from '../../services/api';

const ListaIngresos = ({ idUsuario }) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        setLoading(true);
        const response = await listarIngresos(idUsuario);
        setIngresos(response.data);
      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, [idUsuario]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Lista de Ingresos
      </Heading>
      <VStack align="stretch">
        {ingresos.length > 0 ? (
          ingresos.map((ingreso) => (
            <Box
              key={ingreso.id_ingreso}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text><strong>Fuente:</strong> {ingreso.fuente}</Text>
              <Text><strong>Monto:</strong> ${ingreso.monto.toFixed(2)}</Text>
              <Text><strong>Fecha:</strong> {new Date(ingreso.fecha).toLocaleString()}</Text>
            </Box>
          ))
        ) : (
          <Text>No hay ingresos registrados.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default ListaIngresos;
