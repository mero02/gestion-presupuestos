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
  Spinner,
} from '@chakra-ui/react';
import { crearPresupuesto, actualizarPresupuesto, obtenerCategorias, obtenerMonedas } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FormularioPresupuesto = ({ onPresupuestoRegistrado, presupuestoEditando }) => {
  const [idCategoria, setIdCategoria] = useState('');
  const [idMoneda, setIdMoneda] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [periodo, setPeriodo] = useState('mensual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingMonedas, setLoadingMonedas] = useState(true);
  const toast = useToast();
  const { userId } = useAuth();

  // Color modes
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const helperTextColor = useColorModeValue('gray.600', 'gray.400');

  // Cargar categorías y monedas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasResponse = await obtenerCategorias();
        setCategorias(categoriasResponse);
        setLoadingCategorias(false);

        const monedasResponse = await obtenerMonedas();
        setMonedas(monedasResponse);
        setLoadingMonedas(false);
      } catch (error) {
        toast({
          title: 'Error al cargar',
          description: 'No se pudieron cargar las categorías o monedas.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, []);

  // Prellenar el formulario si se está editando un presupuesto
  useEffect(() => {
    if (presupuestoEditando) {
      setIdCategoria(presupuestoEditando.id_categoria);
      setIdMoneda(presupuestoEditando.id_moneda);
      setMontoObjetivo(presupuestoEditando.monto_objetivo);
      setPeriodo(presupuestoEditando.periodo);
      setFechaInicio(presupuestoEditando.fecha_inicio);
      setFechaFin(presupuestoEditando.fecha_fin);
    }
  }, [presupuestoEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const idUsuario = userId;
      const presupuestoData = {
        id_categoria: idCategoria,
        id_moneda: idMoneda,
        monto_objetivo: parseFloat(montoObjetivo),
        periodo,
        fecha_inicio: new Date(fechaInicio).toISOString(), // Formato ISO
        fecha_fin: new Date(fechaFin).toISOString(), // Formato ISO
      };
      if (presupuestoEditando) {
        await actualizarPresupuesto(presupuestoEditando.id_presupuesto, presupuestoData);
        toast({
          title: 'Presupuesto actualizado',
          description: 'El presupuesto fue actualizado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearPresupuesto(
          idUsuario,
          idCategoria,
          idMoneda,
          presupuestoData.monto_objetivo,
          presupuestoData.periodo,
          presupuestoData.fecha_inicio,
          presupuestoData.fecha_fin
        );
        toast({
          title: 'Presupuesto registrado',
          description: 'El presupuesto fue agregado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onPresupuestoRegistrado();
      setIdCategoria('');
      setIdMoneda('');
      setMontoObjetivo('');
      setPeriodo('mensual');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar/actualizar el presupuesto.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit} 
      width="100%"
    >
      <VStack spacing={6}>
        {/* Campo: Categoría */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Categoría</FormLabel>
          {loadingCategorias ? (
            <Spinner size="sm" />
          ) : (
            <Select
              placeholder="Selecciona una categoría"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.500' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: 'outline'
              }}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Campo: Moneda */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Moneda</FormLabel>
          {loadingMonedas ? (
            <Spinner size="sm" />
          ) : (
            <Select
              placeholder="Selecciona una moneda"
              value={idMoneda}
              onChange={(e) => setIdMoneda(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.500' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: 'outline'
              }}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id_moneda} value={moneda.id_moneda}>
                  {moneda.nombre}
                </option>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Campo: Monto Objetivo */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Monto Objetivo</FormLabel>
          <Input
            type="number"
            placeholder="Ejemplo: 1000"
            value={montoObjetivo}
            onChange={(e) => setMontoObjetivo(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'outline'
            }}
          />
          <FormHelperText color={helperTextColor}>
            Ingresa el monto objetivo para este presupuesto.
          </FormHelperText>
        </FormControl>

        {/* Campo: Período */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Período</FormLabel>
          <Select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'outline'
            }}
          >
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </Select>
        </FormControl>

        {/* Campo: Fecha de Inicio */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Fecha de Inicio</FormLabel>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'outline'
            }}
          />
        </FormControl>

        {/* Campo: Fecha de Fin */}
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Fecha de Fin</FormLabel>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: 'outline'
            }}
          />
        </FormControl>

        {/* Botón de Envío */}
        <Button
          type="submit"
          width="full"
          size="lg"
          isLoading={isSubmitting}
          loadingText={presupuestoEditando ? "Actualizando..." : "Registrando..."}
          bg={"orange.400"}
          boxShadow="xl"
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
          {presupuestoEditando ? 'Actualizar Presupuesto' : 'Registrar Presupuesto'}
        </Button>
      </VStack>
    </Box>
  );
};

export default FormularioPresupuesto;