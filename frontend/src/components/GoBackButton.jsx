import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GoBackButton = ({ label = "", colorScheme = "gray", ...props }) => {
  const navigate = useNavigate();

  return (
    <Button 
      leftIcon={<FaArrowLeft />} 
      colorScheme={colorScheme} 
      onClick={() => navigate(-1)} 
      {...props}
      bg="orange.400"
      color="gray.900"
      size="md"
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
      {label}
    </Button>
  );
};

export default GoBackButton;