import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { getProfile } from '../services/api';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfileData(response.data);
      } catch (error) {
        toast({
          title: 'Error al cargar el perfil',
          description: error.response?.data?.detail || 'Ocurrió un error',
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={4}>
        <Heading>Mi Perfil</Heading>
        {profileData && (
          <VStack align="start" spacing={2}>
            <Text><strong>Bienvenido </strong> {profileData.nombre}</Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default Profile;