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
import { listarPresupuestos, eliminarPresupuesto, obtenerCategorias } from '../../services/api';
import FormularioPresupuesto from './FormularioPresupuesto';
import { useAuth } from '../../context/AuthContext';

const ListaPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose
  } = useDisclosure();
  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const { userId } = useAuth();

  // Color modes
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const fetchPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await listarPresupuestos(userId);

      const categoriasResponse = await obtenerCategorias();
  
      const categoriasMap = {};
      categoriasResponse.forEach((cat) => {
        categoriasMap[cat.id_categoria] = cat.nombre;
      });
  
      const presupuestosConCategoria = Array.isArray(response)
        ? response.map((presupuesto) => {
            const categoriaNombre = categoriasMap[presupuesto.id_categoria] || "Desconocida";
            return {
              ...presupuesto,
              categoria: categoriaNombre,
            };
          })
        : [];
  
      setPresupuestos(presupuestosConCategoria);
      setCategorias(categoriasResponse);
    } catch (error) {
      toast({
        title: 'Error al cargar',
        description: 'No se pudieron cargar los presupuestos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const handleEliminarClick = (presupuesto) => {
    setPresupuestoAEliminar(presupuesto);
    onDeleteAlertOpen();
  };

  const handleEliminarConfirm = async () => {
    try {
      await eliminarPresupuesto(presupuestoAEliminar.id_presupuesto);
      setPresupuestos((prevPresupuestos) =>
        prevPresupuestos.filter((p) => p.id_presupuesto !== presupuestoAEliminar.id_presupuesto)
      );
      toast({
        title: 'Presupuesto eliminado',
        description: 'El presupuesto fue eliminado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el presupuesto.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setPresupuestoAEliminar(null);
    }
  };

  const handleEditar = (presupuesto) => {
    setPresupuestoEditando(presupuesto);
    onOpen();
  };

  const handleActualizarLista = async () => {
    await fetchPresupuestos(); // Actualizamos la lista después de editar
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={textColor}>Cargando presupuestos...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Lista de Presupuestos</Heading>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Total: {presupuestos.length}
        </Badge>
      </HStack>

      {presupuestos.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Categoría</Th>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Monto Objetivo</Th>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Monto Actual</Th>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Período</Th>
                <Th textAlign={'center'} fontWeight="bold" borderColor={borderColor} color={'white'}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {presupuestos.map((presupuesto) => (
                <Tr 
                  key={presupuesto.id_presupuesto}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td textAlign={'center'} borderColor={borderColor}>{presupuesto.categoria}</Td>
                  <Td textAlign={'center'} borderColor={borderColor}>{presupuesto.monto_objetivo}</Td>
                  <Td textAlign={'center'} borderColor={borderColor}>{presupuesto.monto_actual}</Td>
                  <Td textAlign={'center'} borderColor={borderColor}>{presupuesto.periodo}</Td>
                  <Td textAlign={'center'} borderColor={borderColor}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Editar"
                      onClick={() => handleEditar(presupuesto)}
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
                      onClick={() => handleEliminarClick(presupuesto)}
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
          <Text color={textColor}>No hay presupuestos registrados.</Text>
        </Box>
      )}

      {/* Modal para editar presupuesto */}
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
            Editar Presupuesto
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormularioPresupuesto
              presupuestoEditando={presupuestoEditando}
              onPresupuestoRegistrado={handleActualizarLista}
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
              ¿Estás seguro que deseas eliminar este presupuesto? Esta acción no se puede deshacer.
              {presupuestoAEliminar && (
                <Box mt={4}>
                  <Text><strong>Categoría:</strong> {presupuestoAEliminar.categoria}</Text>
                  <Text><strong>Monto Objetivo:</strong> {presupuestoAEliminar.monto_objetivo}</Text>
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

export default ListaPresupuestos;