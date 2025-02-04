import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  FormHelperText,
  InputRightElement,
  Tooltip,
  Select,
} from '@chakra-ui/react';
import { FaDollarSign, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { crearIngreso, actualizarIngreso, obtenerMonedas } from '../../services/api';

const FormularioIngreso = ({ idUsuario, onIngresoRegistrado, ingresoEditando }) => {
  const [monto, setMonto] = useState('');
  const [fuente, setFuente] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [idMoneda, setIdMoneda] = useState('');
  const [monedas, setMonedas] = useState([]);
  
  // Color modes
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const helperTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        const response = await obtenerMonedas();
        setMonedas(response);
        // Set default currency if available
        if (response.length > 0) {
          setIdMoneda(response[0].id_moneda);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las monedas.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    fetchMonedas();
    if (ingresoEditando) {
      setMonto(ingresoEditando.monto);
      setFuente(ingresoEditando.fuente);
      setIdMoneda(ingresoEditando.id_moneda);
    }
  }, [ingresoEditando, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ingresoData = {
        monto: parseFloat(monto),
        fuente,
        id_usuario: idUsuario,
        id_moneda: idMoneda,
      };

      if (ingresoEditando) {
        await actualizarIngreso(ingresoEditando.id_ingreso, ingresoData);
        toast({
          title: 'Ingreso actualizado',
          description: 'El ingreso fue actualizado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearIngreso(ingresoData.monto, ingresoData.fuente, ingresoData.id_usuario, ingresoData.id_moneda);
        toast({
          title: 'Ingreso registrado',
          description: 'El ingreso fue agregado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onIngresoRegistrado();
      setMonto('');
      setFuente('');
      setIdMoneda('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar/actualizar el ingreso.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidMonto = monto !== '' && !isNaN(monto) && parseFloat(monto) > 0;
  const isValidFuente = fuente.trim().length >= 3;
  const isValidMoneda = idMoneda !== '';

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit} 
      width="100%"
    >
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel fontWeight="medium">Moneda</FormLabel>
          <Select
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
            <option value="">Selecciona una moneda</option>
            {monedas.map((moneda) => (
              <option key={moneda.id_moneda} value={moneda.id_moneda}>
                {moneda.nombre}
              </option>
            ))}
          </Select>
          <FormHelperText color={helperTextColor}>
            Selecciona la moneda del ingreso
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Monto</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FaDollarSign} color={iconColor} />}
            />
            <Input
              type="number"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.500' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: 'outline'
              }}
              step="0.01"
              min="0"
            />
            {isValidMonto && (
              <InputRightElement>
                <Icon as={FaCheckCircle} color="green.500" />
              </InputRightElement>
            )}
          </InputGroup>
          <FormHelperText color={helperTextColor}>
            Ingresa el monto en la moneda seleccionada
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Fuente</FormLabel>
          <InputGroup>
            <Input
              type="text"
              placeholder="Ejemplo: Sueldo, Venta, etc."
              value={fuente}
              onChange={(e) => setFuente(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.500' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: 'outline'
              }}
            />
            <InputRightElement>
              <Tooltip 
                label="Describe el origen del ingreso" 
                placement="top"
                hasArrow
              >
                <Icon as={FaInfoCircle} color={iconColor} />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          <FormHelperText color={helperTextColor}>
            Mínimo 3 caracteres
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          width="full"
          size="lg"
          isLoading={isSubmitting}
          loadingText={ingresoEditando ? "Actualizando..." : "Registrando..."}
          isDisabled={!isValidMonto || !isValidFuente || !isValidMoneda}
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
          {ingresoEditando ? 'Actualizar Ingreso' : 'Registrar Ingreso'}
        </Button>
      </VStack>
    </Box>
  );
};

export default FormularioIngreso;