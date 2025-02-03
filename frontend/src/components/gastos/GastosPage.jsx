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
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import FormularioGasto from './FormularioGasto';
import ListaGastos from './ListaGastos';
import { useAuth } from '../../context/AuthContext';

const GastosPage = () => {
  const [actualizarLista, setActualizarLista] = useState(false);
  const { userId } = useAuth();
  const idUsuario = userId;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color modes for better theme support
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleGastoRegistrado = () => {
    setActualizarLista((prev) => !prev);
    onClose();
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
                <Heading size="lg">Gestión de Gastos</Heading>
                <Text color="gray.500" fontSize="sm">
                  Administra tus Gastos de manera eficiente
                </Text>
              </VStack>
              <IconButton
                icon={<FaPlus />}
                title='Agregar Gasto'
                colorScheme="blue"
                size="lg"
                aria-label="Agregar Gasto"
                onClick={onOpen}
                borderRadius="full"
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            </HStack>
          </Box>

          {/* Modal */}
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
                Registrar Nuevo Gasto
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody py={6}>
                <FormularioGasto 
                  idUsuario={idUsuario} 
                  onGastoRegistrado={handleGastoRegistrado} 
                />
              </ModalBody>
              <ModalFooter 
                borderTopWidth="1px" 
                borderColor={borderColor}
              >
                <Button 
                  onClick={onClose} 
                  colorScheme="red" 
                  variant="outline"
                  mr={3}
                  _hover={{
                    bg: 'red.50'
                  }}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Lista de gastos */}
          <Box
            bg={headerBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            <ListaGastos idUsuario={idUsuario} key={actualizarLista} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GastosPage;