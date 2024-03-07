import React, { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Toast,
  useToast,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { startEvent } from '../services/callTelemetryIntract'
import { minSafeInteger } from '@chakra-ui/utils'
import {error} from '../services/telementryService';
export default function Login({setIsLoggedIn = false}) {
  useEffect(() => {
    setIsLoggedIn(false);
  }, [Navigate, setIsLoggedIn]);

  const boxShadowStyle = {
    boxShadow: '-4px 8px 19px -1px',
  };
  const [virtualID, setVirtualID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast()
  const handleSubmit = async (username, password) => {
    try {
      localStorage.removeItem('userPracticeState')
      const response = await fetch(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/v1/vid/generateVirtualID?username=${username}&password=${password}`
        );
      if (response.ok) {
        startEvent();
        const data = await response.json();
        const virtualID = data.virtualID;
        localStorage.setItem('virtualID', virtualID);
        setVirtualID(virtualID);
        localStorage.setItem(
          'virtualStorySessionID',
          virtualID + '' + Date.now()
        );
        toast({
          position: 'top',
          title: `Successfully Login!`,
          duration: 1000,
          status: 'success'
        })
        setIsLoggedIn(true);
        navigate('/discoverylist')

        // localStorage.setItem('userPracticeState', 0)
        localStorage.setItem('validationSession', '')
        localStorage.setItem('practiceSession', '');
        if (!localStorage.getItem('apphomelang')) localStorage.setItem('apphomelang', 'ta');
      } else {
        toast({
          position: 'top',
          title: `Error fetching virtual ID`,
          status: 'error',
        })
      }
    } catch (err) {
      toast({
        position: 'top',
        title: `${err?.message === "Failed to fetch" ? "Please Check Your Internet Connection" : err?.message}`,
        status: 'error',
      })
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
    await fetchMileStone();
    await handleGetLesson(virtualID)
  };
  const fetchMileStone = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_LEARNER_AI_APP_HOST
        }/lais/scores/getMilestone/user/${localStorage.getItem(
          'virtualID'
        )}?language=${localStorage.getItem('apphomelang')}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          localStorage.setItem('userCurrentLevel', data?.data?.milestone_level);
        });
    } catch (err) {
      toast({
        position: 'top',
        title: `${
          err?.message === 'Failed to fetch'
            ? 'Please Check Your Internet Connection'
            : err?.message
        }`,
        status: 'error',
      });
      error(err, { err: err.name, errtype: 'CONTENT' }, 'ET');
    }
  };

  const handleGetLesson = (virtualID)=>{
    fetch(`${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lp-tracker/api/lesson/getLessonProgressByUserId/${virtualID}?language=${localStorage.getItem('apphomelang')}`)
    .then((res)=>{
      return res.json();
    }).then((data)=>{
      if(data?.result?.result){
        let milestone = data?.result?.result?.milestone || 'discoveryList';
        localStorage.setItem('userPracticeState', data?.result?.result?.lesson)
        if(milestone === 'showcase'){
            navigate(`/showcase`)  
          }
          else if(milestone === 'practice'){
            navigate(`/practice`)  
          }
          else if (milestone === 'validate'){
            localStorage.setItem('validationSession', data?.result?.result?.lesson)
            navigate(`/validate`)
          }
        else{
          navigate(`/${milestone}`)
        }
      }
    })
  }

  return (
    <Flex
      className='bg'
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width={'600px'}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
          </Stack>
          <Stack spacing={4}>
            <FormControl id="uername" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    style={{ top: '-20px' }}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                className='btn-primary'
                colorScheme='blue'
                onClick={() => handleSubmit(username, password)}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>

  )
}
