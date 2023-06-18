import { Box, Center, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

export default function Footer({ menues, routeDynamics, width, ...props }) {
  const path = window?.location?.pathname.toString();
  const navigate = useNavigate();

  const footerMenus = menues;

  const PressableNew = ({ item, children, ...prop }) => {
    return item?.link ? (
      <Box
        {...prop}
        onClick={() => {
          navigate(
            routeDynamics
              ? generatePath(item.link, { ...{ id: item.id } })
              : item.link
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
    <Stack minH={'66px'} width={width ? width : '100%'}>
      <Box width={width ? width : '100%'} flex={1} position="fixed" bottom="0">
        <Center flex={1}></Center>
        <HStack
          pl={'20px'}
          pr={'20px'}
          bg="white"
          alignItems="center"
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
