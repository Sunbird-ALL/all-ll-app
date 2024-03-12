import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { end } from '../../services/telementryService';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import TimerLogo from '../../assests/Images/timer.png';
import PowerLogo from '../../assests/Images/power_logo.png';
import { fetchPointerApi } from '../../utils/api/PointerApi';
import MoneyBag from '../../assests/Images/Points.png';
import EngIcon from '../../assests/Images/english-icon.svg';
import TamilIcon from '../../assests/Images/tamil-icon.svg';
import KanndaIcon from '../../assests/Images/kannada-icon.svg';

const AppTimer = ({ isLoggedIn, setIsLoggedIn }) => {
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeoutCount, setTimeOutCount] = useState(120);
  useEffect(() => {
    let interval;
    let totalTime = 1920;
    let sessionTimeOut = '30:00';
    let forceLogOut = 32;
    if (isLoggedIn && timer <= totalTime) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);

        if (formatTime(timer).slice(0, 2) >= forceLogOut) {
          setTimeOutCount(120);
          handleLogout();
        }
        if (formatTime(timer) >= sessionTimeOut && timeoutCount > 0) {
          onOpen();
          setTimeOutCount(prevTimer => prevTimer - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, timer, timeoutCount, isOpen]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const result = await fetchPointerApi();

        if (result && result.result) {
          localStorage.setItem(
            'totalSessionPoints',
            result.result.totalSessionPoints
          );
          localStorage.setItem(
            'totalUserPoints',
            result.result.totalUserPoints
          );
          localStorage.setItem(
            'totalLanguagePoints',
            result.result.totalLanguagePoints
          );
        } else {
          console.error('Unexpected response structure:', result);
        }
      } catch (error) {
        console.error('Error in component:', error);
      }
    };
    if (isLoggedIn) {
      fetchDataFromApi();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    onClose();
    localStorage.setItem('totalSessionPoints', 0);
    localStorage.setItem('totalUserPoints', 0);
    localStorage.setItem('totalLanguagePoints', 0);
    localStorage.removeItem('isAudioPreprocessing');
    const progressData = JSON.parse(localStorage.getItem('progressData'));
    localStorage.removeItem('virtualID');
    if (
      progressData &&
      progressData[localStorage.getItem('practiceSession')]?.progressPercent
    ) {
      end({
        summary: [
          {
            progress:
              progressData[localStorage.getItem('practiceSession')]
                ?.progressPercent,
          },
        ],
        duration: timer,
      });
    } else {
      end({});
    }
    setTimer(0);
    navigate('/Login');
  };

  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  const timerStyles = {
    color:
      formatTime(timer).slice(0, 2) >= 25 && formatTime(timer).slice(0, 2) <= 32
        ? 'red'
        : 'black',
  };

  const [is1366x768] = useMediaQuery("(min-width: 1000px) and (max-width: 1416px)");

  return (
    <Box
      w={is1366x768?"99%":"100%"}
      style={{
        position: 'absolute',
        top: '75px',
        textAlign: 'right',
        fontSize: '24px',
        fontWeight: 'bold',
        padding: ' 0 10px',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Time Out</ModalHeader>
          <ModalBody>
            <Box textAlign={'center'} alignItems={'center'} gap={'2'}>
              <Heading>{timeoutCount}</Heading>
              <Text>
                Congratulations!! You have completed the session. Please Log In
                again to Continue...
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              borderColor="red.500"
              color={'red'}
              onClick={handleLogout}
              cursor={'pointer'}
              mr={3}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoggedIn && (
        <Flex h={20} w={'100%'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={'2'}>
            <Flex
              px={3}
              py={1}
              boxShadow={'rgb(236, 236, 236) 2px 2px 15px 5px'}
              borderRadius={10}
              style={{
                visibility:
                  formatTime(timer).slice(0, 2) >= 25 &&
                  formatTime(timer).slice(0, 2) <= 32 &&
                  formatTime(timer).slice(3, 5) % 2 === 0
                    ? 'hidden'
                    : 'visible',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Image src={TimerLogo} height={'35px'} alt="timer_logo" />
              <Text
                fontSize={{ base: '16px', md: '20px', lg: '22px' }}
                style={timerStyles}
              >
                {formatTime(timer)}
              </Text>
            </Flex>
          </Flex>

          <>
            <Flex alignItems={'center'} gap={2}>
              <Flex
                boxShadow={'rgb(236, 236, 236) 2px 2px 15px 5px'}
                px={3}
                py={1}
                borderRadius={10}
                gap={5}
              >
                <Flex alignItems={'center'} gap={2}>
                  <Image
                    h={{ base: 8, sm: 10, md: 10 }}
                    src={
                      localStorage.getItem('apphomelang') === 'en'
                        ? EngIcon
                        : localStorage.getItem('apphomelang') === 'kn'
                        ? KanndaIcon
                        : TamilIcon
                    }
                  />
                  <Badge
                    ml="1"
                    fontSize={{ base: '16px', md: '22px', lg: '24px' }}
                    colorScheme="green"
                  >
                    {localStorage.getItem('totalLanguagePoints')}
                  </Badge>
                </Flex>
                <Flex alignItems={'center'} gap={2}>
                  <Image h={{ base: 8, sm: 10, md: 10 }} src={MoneyBag} />
                  <Badge
                    ml="1"
                    fontSize={{ base: '16px', md: '22px', lg: '24px' }}
                    colorScheme="green"
                  >
                    {localStorage.getItem('totalUserPoints')}
                  </Badge>
                </Flex>
              </Flex>

              <Flex
                h={{ base: 6, sm: 8, md: 10 }}
                justifyContent={'space-between'}
                borderRadius={10}
                px={3}
                alignItems={'center'}
                gap={2}
                cursor={'pointer'}
                onClick={handleLogout}
                _hover={{ bg: 'red.200', borderColor: 'red.300' }}
              >
                <Image
                  h={{ base: 6, sm: 6, md: 9 }}
                  src={PowerLogo}
                  alt="logout"
                />
              </Flex>
            </Flex>
          </>
        </Flex>
      )}
    </Box>
  );
};

export default AppTimer;
