import React from 'react';
import { Box, Flex, IconButton, Text, Link, HStack } from '@chakra-ui/react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="white" py={4} mt={0}>
      <Flex direction="column" align="center">
        {/* Iconos sociales */}
        <HStack spacing={6} mb={0}>
          <Link href="mailto:mero2sp@gmail.com" isExternal aria-label="Enviar correo">
            <IconButton 
              icon={<FaEnvelope />} 
              aria-label="Correo" 
              variant="ghost" 
              color="white"
              _hover={{
                color: "orange.500",
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '2xl'
              }}
              _active={{
                bg: "orange.600",
                transform: 'scale(0.95)'
              }}
            />
          </Link>

          <Link href="https://www.linkedin.com/in/mauro-san-pedro/" isExternal aria-label="LinkedIn">
            <IconButton 
              icon={<FaLinkedin />} 
              aria-label="LinkedIn" 
              variant="ghost" 
              color="white" 
              _hover={{
                color: "orange.500",
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '2xl'
              }}
              _active={{
                bg: "orange.600",
                transform: 'scale(0.95)'
              }}
            />
          </Link>

          <Link href="https://github.com/mero02" isExternal aria-label="GitHub">
            <IconButton 
              icon={<FaGithub />} 
              aria-label="GitHub" 
              variant="ghost" 
              color="white" 
              _hover={{
                color: "orange.500",
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '2xl'
              }}
              _active={{
                bg: "orange.600",
                transform: 'scale(0.95)'
              }}
            />
          </Link>
        </HStack>

        {/* Derechos de autor */}
        <Text fontSize="sm">&copy; {new Date().getFullYear()} Todos los derechos reservados.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
