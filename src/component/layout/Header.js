import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export default function Header({ title, Component, rightComponent, _box }) {
  return Component ? (
    Component
  ) : (
    <Box p="4" {..._box}>
      <HStack justifyContent={'space-between'}>
        <Text fontWeight={'700'} fontSize="24">
          {title}
        </Text>
        {rightComponent}
      </HStack>
    </Box>
  );
}
