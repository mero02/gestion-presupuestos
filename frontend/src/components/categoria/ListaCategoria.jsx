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
import { obtenerCategorias, eliminarCategoria } from '../../services/api';
import FormularioCategoria from './FormularioCategoria';

const ListaCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose
  } = useDisclosure();
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  // Color modes
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await obtenerCategorias();
      setCategorias(response);
    } catch (error) {
      toast({
        title: 'Error al cargar',
        description: 'No se pudieron cargar las categorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleEliminarClick = (categoria) => {
    setCategoriaAEliminar(categoria);
    onDeleteAlertOpen();
  };

  const handleEliminarConfirm = async () => {
    try {
      await eliminarCategoria(categoriaAEliminar.id_categoria);
      setCategorias((prevCategorias) =>
        prevCategorias.filter((categoria) => categoria.id_categoria !== categoriaAEliminar.id_categoria)
      );
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría fue eliminada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar la categoría.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setCategoriaAEliminar(null);
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
    onOpen();
  };

  const handleActualizarLista = async () => {
    await fetchCategorias(); // Actualizamos la lista después de editar
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={textColor}>Cargando categorías...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Lista de Categorías</Heading>
        <Badge colorScheme="blue" p={2} borderRadius="lg">
          Total: {categorias.length}
        </Badge>
      </HStack>

      {categorias.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Nombre</Th>
                <Th borderColor={borderColor}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categorias.map((categoria) => (
                <Tr 
                  key={categoria.id_categoria}
                  _hover={{ bg: hoverBg }}
                  transition="background 0.2s"
                >
                  <Td borderColor={borderColor}>{categoria.nombre}</Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        aria-label="Editar"
                        onClick={() => handleEditar(categoria)}
                        size="sm"
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.2s"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        aria-label="Eliminar"
                        onClick={() => handleEliminarClick(categoria)}
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
          <Text color={textColor}>No hay categorías registradas.</Text>
        </Box>
      )}

      {/* Modal para editar categoría */}
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
            Editar Categoría
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormularioCategoria
              categoriaEditando={categoriaEditando}
              onCategoriaRegistrada={handleActualizarLista}
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
              ¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.
              {categoriaAEliminar && (
                <Box mt={4}>
                  <Text><strong>Nombre:</strong> {categoriaAEliminar.nombre}</Text>
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

export default ListaCategoria;