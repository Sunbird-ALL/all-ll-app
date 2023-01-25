import { Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

export default function CenterCard({ title, _box, _card, children }) {
  return (
    <Flex
      minH={'90vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      {..._box}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
        {..._card}
      >
        {title ? (
          <Heading lineHeight={1.1} fontSize={{ base: '1xl', sm: '2xl' }}>
            {title}
          </Heading>
        ) : (
          <React.Fragment />
        )}
        {children}
      </Stack>
    </Flex>
  );
}
