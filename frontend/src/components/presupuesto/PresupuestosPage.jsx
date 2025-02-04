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
import FormularioPresupuesto from './FormularioPresupuesto';
import ListaPresupuestos from './ListaPresupuestos';
import GoBackButton from '../GoBackButton';

const PresupuestosPage = () => {
  const [actualizarLista, setActualizarLista] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color modes for better theme support
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handlePresupuestoRegistrado = () => {
    setActualizarLista((prev) => !prev); // Actualiza la lista de presupuestos
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
              <GoBackButton/>
              <VStack align="start" spacing={1}>
                <Heading size="lg">Gestión de Presupuestos</Heading>
                <Text color="gray.500" fontSize="sm">
                  Administra tus presupuestos
                </Text>
              </VStack>
              <IconButton
                icon={<FaPlus />}
                title='Agregar Presupuesto'
                bg="orange.400"
                color="gray.900"
                size="lg"
                aria-label="Agregar Presupuesto"
                onClick={onOpen}
                borderRadius="full"
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
              />
            </HStack>
          </Box>

          {/* Modal para agregar presupuesto */}
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
                Registrar Nuevo Presupuesto
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody py={6}>
                <FormularioPresupuesto 
                  onPresupuestoRegistrado={handlePresupuestoRegistrado} 
                />
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Lista de presupuestos */}
          <Box
            bg={headerBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            <ListaPresupuestos key={actualizarLista} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PresupuestosPage;