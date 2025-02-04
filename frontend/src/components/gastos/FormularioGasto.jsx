import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Select,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { crearGasto, obtenerCategorias, actualizarGasto } from '../../services/api';

const FormularioGasto = ({ idUsuario, onGastoRegistrado, gastoEditando }) => {
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Color modes
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Cargar categorías y datos del gasto si está editando
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await obtenerCategorias();
        setCategorias(response);
        
        // Si hay un gasto para editar, establecer los valores iniciales
        if (gastoEditando) {
          setMonto(gastoEditando.monto.toString());
          setIdCategoria(gastoEditando.id_categoria.toString());
        }
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
    fetchCategorias();
  }, [gastoEditando, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const gastoData = {
        monto: parseFloat(monto),
        id_categoria: Number(idCategoria),
        id_usuario: idUsuario,
      };

      if (gastoEditando) {
        await actualizarGasto(gastoEditando.id_gasto, gastoData);
        toast({
          title: 'Gasto actualizado',
          description: 'El gasto fue actualizado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearGasto(gastoData.monto, gastoData.id_categoria, gastoData.id_usuario);
        toast({
          title: 'Gasto registrado',
          description: 'El gasto fue agregado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onGastoRegistrado(); // Actualiza la lista de gastos
      if (!gastoEditando) {
        // Solo limpia el formulario si no está editando
        setMonto('');
        setIdCategoria('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Hubo un problema al ${gastoEditando ? 'actualizar' : 'registrar'} el gasto.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidMonto = monto !== '' && !isNaN(monto) && parseFloat(monto) > 0;
  const isValidCategoria = idCategoria !== '';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={8}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit} 
      p={4} 
      borderWidth="1px" 
      borderRadius="md" 
      boxShadow="md"
      bg={inputBg}
    >
      <FormControl mb={4} isRequired>
        <FormLabel>Monto</FormLabel>
        <Input
          type="number"
          placeholder="Ingresa el monto del gasto"
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
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Categoría</FormLabel>
        <Select
          placeholder="Selecciona una categoría"
          value={idCategoria}
          onChange={(e) => setIdCategoria(e.target.value)}
          bg={inputBg}
          borderColor={borderColor}
          _hover={{ borderColor: 'blue.500' }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: 'outline'
          }}
        >
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button 
        type="submit" 
        width="full"
        isLoading={isSubmitting}
        loadingText={gastoEditando ? "Actualizando..." : "Registrando..."}
        isDisabled={!isValidMonto || !isValidCategoria}
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
        {gastoEditando ? 'Actualizar Gasto' : 'Registrar Gasto'}
      </Button>
    </Box>
  );
};

export default FormularioGasto;