import { HStack, IconButton, Stack } from '@chakra-ui/react';
import React from 'react';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AppBar() {
  const navigat = useNavigate();
  return (
    <HStack justifyContent={'space-between'} p="4">
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={e => navigat(-1)}
        icon={<FaArrowLeft />}
      />
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        icon={<FaBars />}
      />
    </HStack>
  );
}
