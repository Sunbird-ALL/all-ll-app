import { ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Collapse, HStack, IconButton, Text } from '@chakra-ui/react';
import { PresenceContext } from 'framer-motion';
import React, { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

const Collapsible = ({
  header = '',
  children,
  defaultCollapse = true,
  isHeaderBold = true,
  onClickFuction,
  isDisableCollapse,
  collapsButton,
  _icon,
  _header,
  _box,
}) => {
  const [isOpen, setIsOpen] = useState(defaultCollapse);

  React.useEffect(() => {
    setIsOpen(defaultCollapse);
  }, [defaultCollapse, !defaultCollapse]);

  return (
    <Box w="100%" bg="white" p={4} {..._box}>
      <Box
        onClick={() => {
          if (!isDisableCollapse) setIsOpen(!isOpen);
          if (onClickFuction) onClickFuction();
        }}
      >
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          {..._header}
        >
          <Text
            fontWeight={!isHeaderBold ? '400' : '600'}
            fontSize={typeof isHeaderBold === 'undefined' ? 'sm' : ''}
          >
            {header}
          </Text>
          <IconButton
            size="sm"
            isDisabled={true}
            color={!isOpen || collapsButton ? 'coolGray.400' : 'coolGray.600'}
            variant="ghost"
            icon={!isOpen || collapsButton ? <FaArrowDown /> : <ArrowUpIcon />}
            {..._icon}
          />
        </HStack>
      </Box>

      <Collapse in={isOpen} animateOpacity>
        {isOpen ? children : <React.Fragment />}
      </Collapse>
    </Box>
  );
};
export default React.memo(Collapsible);
