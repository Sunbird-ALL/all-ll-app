import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Menu,
  Avatar,
  HStack,
  Text,
  VStack,
  CheckboxGroup,
  Stack,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Radio,
  InputGroup,
  InputLeftAddon,
  Divider,
  StackDivider,
} from '@chakra-ui/react'
import React from 'react';
import Children from '../../assests/Images/children-thumbnail.png'


function AppDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [value, setValue] = React.useState(localStorage.getItem('apphomelang'))
  const [validateLimit, setValidateLimit] = React.useState(localStorage.getItem('validateLimit') || 5)
  const [discoveryLimit, setDiscoveryLimit] = React.useState(localStorage.getItem('discoveryLimit') || 5)
  const [level, setLevel] = React.useState('');

  React.useEffect(() => {
    if (value) {
      localStorage.setItem('apphomelang', value);
    }
  }, [value]);

  React.useEffect(() => {
    if (validateLimit) {
      localStorage.setItem('validateLimit', validateLimit);
    }
  }, [validateLimit]);

  React.useEffect(() => {
    if (discoveryLimit) {
      localStorage.setItem('discoveryLimit', discoveryLimit);
    }
  }, [discoveryLimit]);

  React.useEffect(() => {
    fetchApi();
  }, []);


  const fetchApi = async () => {
    try {
      const response = await fetch(
        `https://www.learnerai-dev.theall.ai/lais/scores/getMilestoneProgress/session/${localStorage.getItem('virtualStorySessionID')}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setLevel(data.currentLevel);
          localStorage.setItem('userCurrentLevel', data.currentLevel)
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Button className='btn btn-success'
        variant={'solid'}
        colorScheme={'teal'}
        onClick={onOpen}
        mr={4} ref={btnRef}
        rightIcon={<Avatar
          size={'sm'}
          src={
            Children
          }
        />}
      >
        My Profile : {localStorage.getItem('virtualID')}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top={'-2'}   size='sm' />
          <DrawerHeader borderBottomWidth='1px'>Profile</DrawerHeader>

          <DrawerBody>
            <Stack spacing='4'>
              <Text fontSize='lg' fontWeight='bold'>
                Hello, {localStorage.getItem('virtualID')}
              </Text>
              <Divider />
              <FormControl>
                <FormLabel>Session ID</FormLabel>
                <Input variant='filled' value={localStorage.getItem('virtualStorySessionID')} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Current Level</FormLabel>
                <Input variant='filled' value={level} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Select Language</FormLabel>
                <RadioGroup onChange={setValue} value={value}>
                  <HStack spacing='4'>
                    <Radio value='en'>English</Radio>
                    <Radio value='kn'>ಕನ್ನಡ</Radio>
                    <Radio value='ta'>தமிழ்</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Select Validation limit</FormLabel>
                <RadioGroup onChange={setValidateLimit} value={validateLimit}>
                  <HStack spacing='4'>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Select Discovery limit</FormLabel>
                <RadioGroup onChange={setDiscoveryLimit} value={discoveryLimit}>
                  <HStack spacing='4'>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => window.location.reload()} colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </>
  )
}

export default AppDrawer;