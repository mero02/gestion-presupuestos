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
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Nombre</Th>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {monedas.map((moneda) => (
                <Tr 
                  key={moneda.id_moneda}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td textAlign={'center'} borderColor={borderColor}>{moneda.nombre}</Td>
                  <Td textAlign={'center'} borderColor={borderColor}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Editar"
                      onClick={() => handleEditar(moneda)}
                      bg="green.400"
                      color="gray.900"
                      size="sm"
                      boxShadow="xl"
                      _hover={{
                        bg: "green.500",
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '2xl'
                      }}
                      _active={{
                        bg: "green.600",
                        transform: 'scale(0.95)'
                      }}
                      mr={2}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Eliminar"
                      onClick={() => handleEliminarClick(moneda)}
                      bg="red.400"
                      color="gray.900"
                      size="sm"
                      boxShadow="xl"
                      _hover={{
                        bg: "red.500",
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '2xl'
                      }}
                      _active={{
                        bg: "red.600",
                        transform: 'scale(0.95)'
                      }}
                    />
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
              <Button 
                onClick={handleEliminarConfirm} 
                mr={3}
                bg="red.500"
                boxShadow="xl"
                _hover={{
                  bg: "red.500",
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '2xl'
                }}
                _active={{
                  bg: "red.600",
                  transform: 'scale(0.95)'
                }}
              >
                Eliminar
              </Button>
              <Button 
                bg="green.500"
                boxShadow="xl"
                _hover={{
                  bg: "green.500",
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '2xl'
                }}
                _active={{
                  bg: "green.600",
                  transform: 'scale(0.95)'
                }}
                ref={cancelRef} onClick={onDeleteAlertClose}
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ListaMoneda;