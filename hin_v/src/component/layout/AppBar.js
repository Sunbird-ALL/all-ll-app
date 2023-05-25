import { HStack, IconButton, Stack } from '@chakra-ui/react';
import React from 'react';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AppBar() {
  const navigat = useNavigate();
  return (
    <HStack justifyContent={'space-between'} p="4">
      <IconButton
        variant="ghost"
        color="current"
        onClick={e => navigat(-1)}
        icon={<FaArrowLeft />}
      />
      <IconButton variant="ghost" color="current" icon={<FaBars />} />
    </HStack>
  );
}
