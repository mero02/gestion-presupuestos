import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import FormularioCategoria from './FormularioCategoria';
import ListaCategoria from './ListaCategoria';

const CategoriaPage = () => {
  const [actualizarLista, setActualizarLista] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color modes for better theme support
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleCategoriaRegistrada = () => {
    setActualizarLista((prev) => !prev); // Actualiza la lista de categorías
    onClose(); // Cierra el modal
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          {/* Header Section */}
          <Box 
            bg={headerBg}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="lg">Gestión de Categorías</Heading>
                <Text color="gray.500" fontSize="sm">
                  Administra tus categorías de gastos
                </Text>
              </VStack>
              <IconButton
                icon={<FaPlus />}
                title="Agregar Categoría"
                colorScheme="blue"
                size="lg"
                aria-label="Agregar Categoría"
                onClick={onOpen}
                borderRadius="full"
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            </HStack>
          </Box>

          {/* Modal para agregar categoría */}
          <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            motionPreset="slideInBottom"
            size="xl"
          >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="xl" mx={4}>
              <ModalHeader 
                borderBottomWidth="1px" 
                borderColor={borderColor}
                py={4}
              >
                Registrar Nueva Categoría
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody py={6}>
                <FormularioCategoria 
                  onCategoriaRegistrada={handleCategoriaRegistrada} 
                />
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Lista de categorías */}
          <Box
            bg={headerBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            <ListaCategoria key={actualizarLista} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default CategoriaPage;