import { Card, CardBody, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Menus({
  menus,
  rightComponent,
  _vstack,
  _body,
  _card,
}) {
  return (
    <VStack spacing={4} {..._vstack} w={'100%'}>
      {menus.map((item, key) => (
        <Menu {...{ key, item, rightComponent, _card, _body }} />
      ))}
    </VStack>
  );
}

export function Menu({ item, rightComponent, _card, _body }) {
  const navigate = useNavigate();
  return (
    <Card
      w={'100%'}
      cursor="pointer"
      onClick={e =>
        item?.link ? navigate(item?.link) : console.log('not link')
      }
      {..._card}
    >
      <CardBody {..._body}>
        <HStack justifyContent={'space-between'}>
          <Text>
            {item?.title ? item?.title : item?.name}
            <br />
            <b> {item?.type ? item?.type : ''}</b>
            <b> {item?.en ? 'English' : ''}</b>
            <b> {item?.ta ? 'Hindi' : ''}</b>
          </Text>
          {rightComponent ? rightComponent : item?.icon}
        </HStack>
      </CardBody>
    </Card>
  );
}
