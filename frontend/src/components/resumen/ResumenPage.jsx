import React, { useEffect, useState } from 'react';
import {Box, Card, CardBody, CardHeader, Heading, VStack, Text, Spinner, useColorModeValue, HStack,
  Select, Container, Alert, AlertIcon, Grid, GridItem, Stat, StatLabel, StatNumber, StatArrow, Flex} from '@chakra-ui/react';
import { obtenerResumen } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import PieChartGastos from './PieChartGastos';
import PieChartIngresos from './PieChartIngresos';
import GoBackButton from '../GoBackButton';

// Constantes
const MESES = Array.from({ length: 12 }, (_, i) => ({
  valor: i + 1,
  etiqueta: new Date(2023, i).toLocaleString('default', { month: 'long' })
}));

// Componentes auxiliares
const EstadoCarga = () => (
  <Flex height="50vh" justifyContent="center" alignItems="center">
    <VStack spacing={6}>
      <Spinner 
        size="xl" 
        thickness="4px"
        speed="0.8s"
        emptyColor="gray.200"
        color="blue.500"
      />
      <Text fontSize="lg" color="gray.600">
        Cargando tu resumen financiero...
      </Text>
    </VStack>
  </Flex>
);

const EstadoError = ({ mensaje }) => (
  <Alert 
    status="error" 
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
    borderRadius="lg"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <Text mt={4} mb={1} fontSize="lg">
      Lo sentimos
    </Text>
    <Text fontSize="sm" color="gray.600">
      {mensaje}
    </Text>
  </Alert>
);

const SelectorFecha = ({ mes, año, onMesChange, onAñoChange }) => {
  const fechaActual = new Date();
  const años = Array.from(
    { length: 5 },
    (_, i) => fechaActual.getFullYear() - 2 + i
  );
  
  const selectBg = useColorModeValue('white', 'gray.700');
  const selectBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card variant="outline" p={4}>
      <HStack spacing={4}>
        <Select
          value={mes}
          onChange={e => onMesChange(Number(e.target.value))}
          bg={selectBg}
          borderColor={selectBorder}
          size="md"
          flex={2}
        >
          {MESES.map(({ valor, etiqueta }) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </Select>

        <Select
          value={año}
          onChange={e => onAñoChange(Number(e.target.value))}
          bg={selectBg}
          borderColor={selectBorder}
          size="md"
          flex={2}
        >
          {años.map(año => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </Select>
      </HStack>
    </Card>
  );
};

const EstadisticaCard = ({ titulo, valor, tipo, porcentaje }) => {
  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Card 
      bg={bgCard} 
      borderColor={borderColor} 
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <CardBody>
        <Stat>
          <StatLabel color={textColor} fontSize="sm">
            {titulo}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" mt={2}>
            ${valor.toLocaleString()}
          </StatNumber>
          {porcentaje && (
            <HStack mt={2}>
              <StatArrow 
                type={tipo === 'increase' ? 'increase' : 'decrease'} 
              />
              <Text fontSize="sm" color={tipo === 'increase' ? 'green.500' : 'red.500'}>
                {porcentaje}%
              </Text>
            </HStack>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
};

const ResumenDetalle = ({ resumen }) => {
  const calcularPorcentajeCambio = (actual, anterior) => {
    if (!anterior) return null;
    return ((actual - anterior) / anterior * 100).toFixed(1);
  };

  return (
    <Grid 
      templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
      gap={4}
      width="100%"
    >
      <GridItem>
        <EstadisticaCard
          titulo="Total Ingresos"
          valor={resumen.total_ingresos}
          tipo="increase"
          porcentaje={calcularPorcentajeCambio(resumen.total_ingresos, resumen.ingresos_anterior)}
        />
      </GridItem>
      <GridItem>
        <EstadisticaCard
          titulo="Total Gastos"
          valor={resumen.total_gastos}
          tipo="decrease"
          porcentaje={calcularPorcentajeCambio(resumen.total_gastos, resumen.gastos_anterior)}
        />
      </GridItem>
      <GridItem>
        <EstadisticaCard
          titulo="Balance"
          valor={resumen.balance}
          tipo={resumen.balance >= 0 ? 'increase' : 'decrease'}
        />
      </GridItem>
    </Grid>
  );
};

const GraficosResumen = ({ resumen }) => {
  return (
    <Grid 
      templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
      gap={6}
      mt={6}
    >
      <GridItem>
        <Card p={4} height="100%">
          <CardHeader pb={0}>
            <Heading size="sm">Evolución Mensual</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <BarChartComponent data={resumen} />
            </Box>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem>
        <Card p={4} height="100%">
          <CardHeader pb={0}>
            <Heading size="sm">Distribución de Gastos</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <PieChartComponent data={resumen} />
            </Box>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem>
        <Card p={4} height="100%">
          <CardHeader pb={0}>
            <Heading size="sm">Detalle de Ingresos</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <PieChartIngresos/>
            </Box>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem>
        <Card p={4} height="100%">
          <CardHeader pb={0}>
            <Heading size="sm">Detalle de Gastos</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <PieChartGastos/>
            </Box>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

const ResumenPage = () => {
  const { userId } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fechaActual = new Date();
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);
  const [año, setAño] = useState(fechaActual.getFullYear());

  const bgPage = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
    const obtenerDatos = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const datos = await obtenerResumen(userId, mes, año);
        setResumen(datos);
      } catch (err) {
        setError('Error al cargar el resumen.');
        console.error('Error al obtener resumen:', err);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [userId, mes, año]);

  if (loading) return <EstadoCarga />;
  if (error) return <EstadoError mensaje={error} />;

  return (
    <Box bg={bgPage} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={4} align="stretch"> 
          <Flex justifyContent="space-between" alignItems="center">
            <GoBackButton />
            <Heading size="lg">Resumen Financiero</Heading>
            <SelectorFecha
              mes={mes}
              año={año}
              onMesChange={setMes}
              onAñoChange={setAño}
            />
          </Flex>

          {resumen ? (
            <>
              <ResumenDetalle resumen={resumen} />
              <GraficosResumen resumen={resumen} />
            </>
          ) : (
            <Card p={8} textAlign="center">
              <Text color="gray.500">
                No hay datos disponibles para el período seleccionado.
              </Text>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ResumenPage;