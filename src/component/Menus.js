import { Card, CardBody, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Menus({ menus, _vstack, _body, _card }) {
  const navigate = useNavigate();
  return (
    <VStack spacing={4} {..._vstack}>
      {menus.map((item, key) => (
        <Card
          key={key}
          width={'100%'}
          cursor="pointer"
          onClick={e =>
            item?.link ? navigate(item?.link) : console.log('not link')
          }
          {..._card}
        >
          <CardBody {..._body}>
            <HStack justifyContent={'space-between'}>
              <Text>{item?.title}</Text>
              {item?.icon}
            </HStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
