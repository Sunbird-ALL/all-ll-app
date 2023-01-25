import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export default function Header({ title, _box }) {
  return (
    <Box p="4" {..._box}>
      <Text fontWeight={'700'} fontSize="24">
        {title}
      </Text>
    </Box>
  );
}
