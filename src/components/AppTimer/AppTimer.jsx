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
} from '@chakra-ui/react';
import TimerLogo from '../../assests/Images/timer.png';
import PowerLogo from '../../assests/Images/power_logo.png';
import { fetchPointerApi } from '../../utils/api/PointerApi';
import MoneyBag from '../../assests/Images/Points.png';

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
    if(isLoggedIn){

    fetchDataFromApi();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    onClose();
    localStorage.setItem('totalSessionPoints', 0);
    localStorage.setItem('totalUserPoints', 0);
    localStorage.setItem('totalLanguagePoints', 0);
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

  return (
    <div
      style={{
        position: 'absolute',
        top: '55px',
        textAlign: 'right',
        fontSize: '24px',
        fontWeight: 'bold',
        padding: '10px',
        width: '100%',
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
              border="2px"
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
        <>
       <Flex alignItems={'center'} gap={'2'}>
       <Box 
        style={{
        position: 'absolute',
        left: '15px',
        top: '30px', 
        display: 'flex', 
        alignItems: 'center', 
       }}
        >
        <h5 style={{ fontSize: '16px' }}>{localStorage.getItem('apphomelang') === 'en' ? 'English' : localStorage.getItem('apphomelang') === 'kn' ? 'Kannada' : 'Tamil'}</h5>
        <Badge ml="1" fontSize="1.1em" colorScheme="green">
        {localStorage.getItem('totalLanguagePoints')}
        </Badge>
        </Box>
        </Flex>

        <Flex pos={'absolute'} right={0} w={'100%'}>
          <Box textAlign={'start'} pl={5}>
            {/* <Text>Total Points:- {localStorage.getItem('totalUserPoints')}</Text>
        <Text>Current Points:- {localStorage.getItem('totalSessionPoints')}</Text> */}
          </Box>
          <Box
            style={{ position: 'absolute', textAlign: 'center', right: '0' }}
          >
            <div
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
              <p style={timerStyles}>{formatTime(timer)}</p>
            </div>
            <Flex alignItems={'center'} gap={'2'}>
              <Image h={7} src={MoneyBag} />
              <Badge ml="1" fontSize="1.1em" colorScheme="green">
                {localStorage.getItem('totalUserPoints')}
              </Badge>
              <Box display={'flex'} gap={5}>
                <Image
                  height={'35px'}
                  src={PowerLogo}
                  onClick={handleLogout}
                  cursor={'pointer'}
                  alt=""
                />
              </Box>
            </Flex>
          </Box>
        </Flex>
        </>
      )}
    </div>
  );
};

export default AppTimer;
