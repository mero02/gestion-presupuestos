import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { AiOutlineDashboard, AiFillSignal } from "react-icons/ai";
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const {user} = useAuth();
  // Definición de las tarjetas con rutas e íconos
  const cards = [
    { id: 'income', title: 'Ingresos', route: '/ingresospage', icon: FiTrendingUp, color: 'green.500' },
    { id: 'expenses', title: 'Gastos', route: '/gastospage', icon: FiTrendingDown, color: 'red.500' },
    { id: 'summary', title: 'Resumen', route: '/resumenpage', icon: AiOutlineDashboard, color: 'blue.500' },
    { id: 'budget', title: 'Presupuesto', route: '/presupuestopage', icon: AiFillSignal, color: 'purple.500' },
  ];

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center" size="xl" color="gray.700">Mi Perfil</Heading>
        <Box bg="gray.100" p={6} borderRadius="lg" boxShadow="sm">
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            Bienvenido,  {user.email}
          </Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          {cards.map((card) => (
            <GridItem key={card.id}>
              <RouterLink to={card.route} style={{ textDecoration: 'none' }}>
                <Card 
                  variant="elevated" 
                  _hover={{ 
                    transform: 'scale(1.05)', 
                    boxShadow: 'lg' 
                  }} 
                  transition="all 0.2s"
                >
                  <CardBody>
                    <HStack justify="space-between" align="center">
                      <Text fontWeight="semibold" color="gray.500">{card.title}</Text>
                      <Icon 
                        as={card.icon} 
                        w={6} 
                        h={6} 
                        color={card.color} 
                      />
                    </HStack>
                  </CardBody>
                </Card>
              </RouterLink>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default Profile;
