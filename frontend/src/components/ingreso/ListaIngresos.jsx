import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  VStack,
  useColorModeValue,
  Badge,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { listarIngresos, eliminarIngreso, obtenerMonedas } from '../../services/api';
import { obtenerTasaCambio } from '../../services/currency';
import FormularioIngreso from './FormularioIngreso';

const ListaIngresos = ({ idUsuario }) => {
  const [ingresos, setIngresos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [tasasCambio, setTasasCambio] = useState({});
  const [loading, setLoading] = useState(true);
  const [ingresoEditando, setIngresoEditando] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose
  } = useDisclosure();
  const [ingresoAEliminar, setIngresoAEliminar] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  // Color modes
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const fetchIngresos = async () => {
    try {
      setLoading(true);
      const response = await listarIngresos(idUsuario);
      setIngresos(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        toast({
          title: 'Error al cargar',
          description: 'No hay ingresos cargados',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMonedas = async () => {
    try {
      const response = await obtenerMonedas();
      setMonedas(response);
    } catch (error) {
      console.error('Error al obtener monedas:', error);
    }
  };

  const fetchTasas = async () => {
    const tasas = await obtenerTasaCambio();
    if (tasas) setTasasCambio(tasas);
  };

  useEffect(() => {
    fetchIngresos();
    fetchMonedas();
    fetchTasas();
  }, [idUsuario]);

  const handleEliminarClick = (ingreso) => {
    setIngresoAEliminar(ingreso);
    onDeleteAlertOpen();
  };

  const handleEliminarConfirm = async () => {
    try {
      await eliminarIngreso(ingresoAEliminar.id_ingreso);
      setIngresos((prevIngresos) =>
        prevIngresos.filter((ingreso) => ingreso.id_ingreso !== ingresoAEliminar.id_ingreso)
      );
      toast({
        title: 'Ingreso eliminado',
        description: 'El ingreso fue eliminado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el ingreso.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setIngresoAEliminar(null);
    }
  };

  const handleEditar = (ingreso) => {
    setIngresoEditando(ingreso);
    onOpen();
  };

  const handleActualizarLista = async () => {
    await fetchIngresos(); // Actualizamos la lista después de editar
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={textColor}>Cargando ingresos...</Text>
        </VStack>
      </Box>
    );
  }

  const calcularTotalIngresos = () => {
    // Mapeo de nombres a códigos de moneda
    const mapaMonedas = {
      "Pesos": "ARS",
      "Dolar": "USD",
      "Euro": "EUR"
    };
  
    return ingresos.reduce((sum, ingreso) => {
      let montoConvertido = ingreso.monto;
  
      // Buscar el nombre de la moneda
      const monedaEncontrada = monedas.find(m => m.id_moneda === ingreso.id_moneda);
      const nombreMoneda = monedaEncontrada ? monedaEncontrada.nombre : null;
      // Convertir nombre a código
      const codigoMoneda = nombreMoneda ? mapaMonedas[nombreMoneda] : null;
  
      if (codigoMoneda && codigoMoneda !== 'ARS' && tasasCambio[codigoMoneda]) {
        montoConvertido = ingreso.monto * (tasasCambio['ARS'] / tasasCambio[codigoMoneda]);
      }
  
      return sum + montoConvertido;
    }, 0);
  };
  

  return (
    <Box p={4}>
      <Heading size="md">Lista de Ingresos</Heading>
      <HStack justify="flex-end" mb={4}>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Dolar: ${tasasCambio['ARS']}
        </Badge>
        <Badge colorScheme="green" p={2} borderRadius="lg">
          Total: ${calcularTotalIngresos().toFixed(2)} ARS
        </Badge>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Total: {ingresos.length}
        </Badge>
      </HStack>

      {ingresos.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Fuente</Th>
                <Th borderColor={borderColor}>Monto</Th>
                <Th borderColor={borderColor}>Moneda</Th> 
                <Th borderColor={borderColor}>Fecha</Th>
                <Th borderColor={borderColor}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ingresos.map((ingreso) => (
                <Tr 
                  key={ingreso.id_ingreso}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td borderColor={borderColor}>{ingreso.fuente}</Td>
                  <Td borderColor={borderColor}>
                    <Badge colorScheme="green" fontSize="md" px={2}>
                      ${ingreso.monto.toFixed(2)}
                    </Badge>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text as="span" ml={2} fontSize="md" color={textColor}>
                      {monedas.find(m => m.id_moneda === ingreso.id_moneda)?.nombre || 'Desconocido'}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>{new Date(ingreso.fecha).toLocaleString()}</Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        aria-label="Editar"
                        onClick={() => handleEditar(ingreso)}
                        size="sm"
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.2s"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Eliminar"
                        onClick={() => handleEliminarClick(ingreso)}
                        size="sm"
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.2s"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box
          p={8}
          textAlign="center"
          bg={tableBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Text color={textColor}>No hay ingresos registrados.</Text>
        </Box>
      )}

      {/* Modal para editar ingreso */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        motionPreset="slideInBottom"
        size="xl"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader 
            borderBottomWidth="1px" 
            borderColor={borderColor}
            py={4}
          >
            Editar Ingreso
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormularioIngreso
              idUsuario={idUsuario}
              ingresoEditando={ingresoEditando}
              onIngresoRegistrado={handleActualizarLista}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* AlertDialog para confirmar eliminación */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar este ingreso? Esta acción no se puede deshacer.
              {ingresoAEliminar && (
                <Box mt={4}>
                  <Text><strong>Fuente:</strong> {ingresoAEliminar.fuente}</Text>
                  <Text><strong>Monto:</strong> ${ingresoAEliminar.monto.toFixed(2)}</Text>
                </Box>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleEliminarConfirm} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ListaIngresos;