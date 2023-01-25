import {
  Box,
  Center,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { generatePath, useNavigate } from 'react-router-dom';

export default function Footer({ menues, routeDynamics, ...props }) {
  const path = window?.location?.pathname.toString();
  const navigate = useNavigate();

  const footerMenus = menues;

  const PressableNew = ({ item, children, ...prop }) => {
    return item?.route ? (
      <Box
        {...prop}
        onClick={() => {
          navigate(
            routeDynamics
              ? generatePath(item.route, { ...{ id: item.id } })
              : item.route
          );
        }}
      >
        {children}
      </Box>
    ) : (
      <Box {...prop}>{children}</Box>
    );
  };

  return (
    <Stack minH={'66px'}>
      <Box width={'100%'} flex={1} safeAreaTop position="fixed" bottom="0">
        <Center flex={1}></Center>
        <HStack
          pl={'20px'}
          pr={'20px'}
          bg="white"
          alignItems="center"
          safeAreaBottom
          shadow={6}
        >
          {footerMenus?.map((item, index) => (
            <PressableNew
              item={item}
              key={index}
              cursor="pointer"
              py="3"
              flex={1}
              alignItems="center"
            >
              {Array.isArray(item?.selected) &&
              (item?.selected?.find(e => path.startsWith(e) && e !== '/') ||
                item.selected.includes(path)) ? (
                <VStack alignItems="center">
                  {item.icon}
                  <Text fontSize="12" color={'red.100'}>
                    {item.title}
                  </Text>
                </VStack>
              ) : (
                <VStack alignItems={'center'}>
                  {item.icon}
                  <Text fontSize="12" color={'red.500'}>
                    {item.title}
                  </Text>
                </VStack>
              )}
            </PressableNew>
          ))}
        </HStack>
      </Box>
    </Stack>
  );
}
