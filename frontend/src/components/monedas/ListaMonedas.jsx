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
import { obtenerMonedas, eliminarMoneda } from '../../services/api';
import FormularioMoneda from './FormularioMoneda';

const ListaMoneda = () => {
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monedaEditando, setMonedaEditando] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose
  } = useDisclosure();
  const [monedaAEliminar, setMonedaAEliminar] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  // Color modes
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const fetchMonedas = async () => {
    try {
      setLoading(true);
      const response = await obtenerMonedas();
      setMonedas(response);
    } catch (error) {
      toast({
        title: 'Error al cargar',
        description: 'No se pudieron cargar las monedas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonedas();
  }, []);

  const handleEliminarClick = (moneda) => {
    setMonedaAEliminar(moneda);
    onDeleteAlertOpen();
  };

  const handleEliminarConfirm = async () => {
    try {
      await eliminarMoneda(monedaAEliminar.id_moneda);
      setMonedas((prevMonedas) =>
        prevMonedas.filter((moneda) => moneda.id_moneda !== monedaAEliminar.id_moneda)
      );
      toast({
        title: 'Moneda eliminada',
        description: 'La moneda fue eliminada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar la moneda.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setMonedaAEliminar(null);
    }
  };

  const handleEditar = (moneda) => {
    setMonedaEditando(moneda);
    onOpen();
  };

  const handleActualizarLista = async () => {
    await fetchMonedas(); // Actualizamos la lista después de editar
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={textColor}>Cargando monedas...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Lista de Monedas</Heading>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Total: {monedas.length}
        </Badge>
      </HStack>

      {monedas.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Nombre</Th>
                <Th borderColor={borderColor}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {monedas.map((moneda) => (
                <Tr 
                  key={moneda.id_moneda}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td borderColor={borderColor}>{moneda.nombre}</Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        aria-label="Editar"
                        onClick={() => handleEditar(moneda)}
                        size="sm"
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.2s"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Eliminar"
                        onClick={() => handleEliminarClick(moneda)}
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
          <Text color={textColor}>No hay monedas registradas.</Text>
        </Box>
      )}

      {/* Modal para editar moneda */}
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
            Editar Moneda
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormularioMoneda
              monedaEditando={monedaEditando}
              onMonedaRegistrada={handleActualizarLista}
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
              ¿Estás seguro que deseas eliminar esta moneda? Esta acción no se puede deshacer.
              {monedaAEliminar && (
                <Box mt={4}>
                  <Text><strong>Nombre:</strong> {monedaAEliminar.nombre}</Text>
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

export default ListaMoneda;