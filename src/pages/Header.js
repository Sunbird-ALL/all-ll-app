'use client';

import {
  Box,
  Flex,
  useDisclosure,
  useColorModeValue,
  Stack,
  Spacer,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  useSteps,
  StepTitle,
  StepDescription,
  StepSeparator,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AppDrawer from '../components/AppDrawer/AppDrawer';
import TabCard from './TabCard';

const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = () => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}
    ></Box>
  );
};
const steps = [
  { title: 'Discover', description: 'Discover' },
  { title: 'Validate', description: 'Validate' },
  { title: 'Practice', description: 'Practice' },
  { title: 'Showcase', description: 'Showcase' },
];

const tabs = [
  { name: 'Discover', link: '/discoverylist' },
  { name: 'Validate', link: '/validate' },
  { name: 'Practice', link: '/practice' },
  { name: 'Showcase', link: '/showcase' },
];

export default function Header({
  active,
  forceRerender = false,
  setForceRerender = () => {},
}) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activeStep, setActiveStep } = useSteps({
    index: active,
    count: steps.length,
  });
  const toast = useToast();

  const setNavigationToRoute = function (a) {
    if (
      (tabs[a].name === 'Discover' || tabs[a].name === 'Validate') &&
      localStorage.getItem('discoveryStatus') === 'disabled'
    ) {
      toast({
        position: 'top',
        title: `Oops! You've already done the discovery. No need to do it again`,
        status: 'warning',
      });
      return false;
    }

    navigate(tabs[a].link);
    localStorage.setItem('tabIndex', a);
  };
  const [isLargerThan865] = useMediaQuery('(min-width: 865px)');

  return (
    <>
      <Box
        h="100%"
        w="100vw"
        style={{
          background: '#fff',
          background: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Flex>
          {/* <Box p={1}>
            <TabCard naviagteTo={(a) => navigate(a)} />
          </Box> */}
          <Box p={3} w={'100vw'}>
            <Stepper size="lg" index={activeStep}>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  onClick={() =>
                    active >= index ? setNavigationToRoute(index) : ''
                  }
                >
                  <StepIndicator>
                    <StepStatus
                      complete={`✅`}
                      incomplete={`🚩`}
                      active={`📍`}
                    />
                    {/* 😐 */}
                  </StepIndicator>

                  <Box flexShrink="0">
                    {/* <StepTitle>{step.title}</StepTitle> */}
                    <StepTitle>
                      {' '}
                      {!isLargerThan865
                        ? step.title === 'Discover'
                          ? 'D'
                          : step.title === 'Validate'
                          ? 'V'
                          : step.title === 'Practice'
                          ? 'P'
                          : step.title === 'Showcase'
                          ? 'S'
                          : step.title
                        : step.title}
                    </StepTitle>
                    {/* <StepDescription>{step.description}</StepDescription> */}
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>
          <Spacer />
          <Box p={1}>
            <AppDrawer
              forceRerender={forceRerender}
              setForceRerender={setForceRerender}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
