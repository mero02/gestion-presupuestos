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
import { listarGastos, eliminarGasto, obtenerCategorias } from '../../services/api';
import FormularioGasto from './FormularioGasto';

const ListaGastos = ({ idUsuario }) => {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gastoEditando, setGastoEditando] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose
  } = useDisclosure();
  const [gastoAEliminar, setGastoAEliminar] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  // Color modes
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const fetchGastos = async () => {
    try {
      setLoading(true);
      const gastosResponse = await listarGastos(idUsuario);
      const categoriasResponse = await obtenerCategorias();
  
      // Crear un diccionario para acceder rápidamente a las categorías por ID
      const categoriasMap = {};
      categoriasResponse.forEach((cat) => {
        categoriasMap[cat.id_categoria] = cat.nombre;
      });
  
      // Asignar el nombre de la categoría a cada gasto
      const gastosConCategoria = gastosResponse.data.map((gasto) => ({
        ...gasto,
        categoria: categoriasMap[gasto.id_categoria] || "Desconocida",
      }));
  
      setGastos(gastosConCategoria);
      setCategorias(categoriasResponse);
    } catch (error) {
      toast({
        title: "Error al cargar",
        description: "No se pudieron cargar los gastos o categorías.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      setCategorias(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
    fetchGastos();
  }, [idUsuario]);

  const handleEliminarClick = (gasto) => {
    setGastoAEliminar(gasto);
    onDeleteAlertOpen();
  };

  const handleEliminarConfirm = async () => {
    try {
      await eliminarGasto(gastoAEliminar.id_gasto);
      setGastos((prevGastos) =>
        prevGastos.filter((gasto) => gasto.id_gasto !== gastoAEliminar.id_gasto)
      );
      toast({
        title: 'Gasto eliminado',
        description: 'El gasto fue eliminado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el gasto.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setGastoAEliminar(null);
    }
  };

  const handleEditar = (gasto) => {
    setGastoEditando(gasto);
    onOpen();
  };

  const handleActualizarLista = async () => {
    await fetchGastos(); // Actualizamos la lista después de editar
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={textColor}>Cargando gastos...</Text>
        </VStack>
      </Box>
    );
  }

  const calcularTotalGastos = () => {
    return gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  };

  return (
    <Box p={4}>
      <Heading size="md">Lista de Gastos</Heading>
      <HStack justify="end" mb={6}>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Total: {gastos.length}
        </Badge>
        <Badge colorScheme="green" p={2} borderRadius="lg">
          Total: ${calcularTotalGastos().toFixed(2)}
        </Badge>
      </HStack>

      {gastos.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Categoria</Th>
                <Th borderColor={borderColor}>Monto</Th>
                <Th borderColor={borderColor}>Fecha</Th>
                <Th borderColor={borderColor}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gastos.map((gasto) => (
                <Tr 
                  key={gasto.id_gasto}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td borderColor={borderColor}>{gasto.categoria}</Td>
                  <Td borderColor={borderColor}>
                    <Badge colorScheme="green" fontSize="md" px={2}>
                      ${gasto.monto.toFixed(2)}
                    </Badge>
                  </Td>
                  <Td borderColor={borderColor}>{new Date(gasto.fecha).toLocaleString()}</Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        aria-label="Editar"
                        onClick={() => handleEditar(gasto)}
                        size="sm"
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.2s"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Eliminar"
                        onClick={() => handleEliminarClick(gasto)}
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
          <Text color={textColor}>No hay gastos registrados.</Text>
        </Box>
      )}

      {/* Modal para editar gasto */}
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
            Editar Gasto
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormularioGasto
              idUsuario={idUsuario}
              gastoEditando={gastoEditando}
              onGastoRegistrado={handleActualizarLista}
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
              ¿Estás seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.
              {gastoAEliminar && (
                <Box mt={4}>
                  <Text><strong>Fuente:</strong> {gastoAEliminar.fuente}</Text>
                  <Text><strong>Monto:</strong> ${gastoAEliminar.monto.toFixed(2)}</Text>
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

export default ListaGastos;