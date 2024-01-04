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
  Avatar,
  HStack,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Radio,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/react'
import React from 'react';
import Children from '../../assests/Images/children-thumbnail.png'
import ConfigForm from '../../config/ConfigForm';


function AppDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [value, setValue] = React.useState(localStorage.getItem('apphomelang'))
  const [validateLimit, setValidateLimit] = React.useState(localStorage.getItem('validateLimit') || 5)
  const [discoveryLimit, setDiscoveryLimit] = React.useState(localStorage.getItem('discoveryLimit') || 5)
  const [contentPracticeLimit, setContentPracticeLimit] = React.useState(localStorage.getItem('contentPracticeLimit') || 5)
  const [contentTargetLimit, setContentTargetLimit] = React.useState(localStorage.getItem('contentTargetLimit') || 5)
  const [PreviousUserSessions, setUserSessions] = React.useState(localStorage.getItem('sessions'))
  const [validationSession, setValidationSession] = React.useState(localStorage.getItem('validationSession') || localStorage.getItem('virtualStorySessionID'))
  const [practiceSession, setPracticeSession] = React.useState(localStorage.getItem('practiceSession') || localStorage.getItem('virtualStorySessionID'))
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
    if (contentPracticeLimit) {
      localStorage.setItem('contentPracticeLimit', contentPracticeLimit);
    }
  }, [contentPracticeLimit]);

  React.useEffect(() => {
    if (contentTargetLimit) {
      localStorage.setItem('contentTargetLimit', contentTargetLimit);
    }
  }, [contentTargetLimit]);

  React.useEffect(() => {
    if (validationSession) {
      localStorage.setItem('validationSession', validationSession);
    }
  }, [validationSession]);

  React.useEffect(() => {
    if (practiceSession) {
      localStorage.setItem('practiceSession', practiceSession);
    }
  }, [practiceSession]);

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

    try {
      const response = await fetch(
        `https://www.learnerai-dev.theall.ai/lais/scores/GetSessionIds/${localStorage.getItem('virtualID')}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setUserSessions(data);
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
        size={'md'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top={'-2'} size='sm' />
          <DrawerHeader borderBottomWidth='1px'>Profile</DrawerHeader>

          <DrawerBody>
            <Stack spacing='4'>
              <Text fontSize='lg' fontWeight='bold'>
                Hello, {localStorage.getItem('virtualID')} <Editable defaultValue={level}>
                  <EditablePreview />
                  <EditableInput onChange={(event) => setLevel(event.target.value)}/>
                </Editable>
              </Text>
              <Divider />
              <FormControl>
                <FormLabel><Text as={'b'} >Session ID</Text></FormLabel>
                <Input variant='filled' value={localStorage.getItem('virtualStorySessionID')} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel><Text as={'b'} >Language </Text></FormLabel>
                <RadioGroup onChange={setValue} value={value}>
                  <HStack spacing='4'>
                    <Radio value='en'>English</Radio>
                    <Radio value='kn'>ಕನ್ನಡ</Radio>
                    <Radio value='ta'>தமிழ்</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel><Text as={'b'} >Discovery </Text></FormLabel>
                <RadioGroup onChange={setDiscoveryLimit} value={discoveryLimit}>
                  <HStack spacing='4'>
                    <span>Limit:</span>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel><Text as={'b'} >Validation </Text></FormLabel>
                <RadioGroup onChange={setValidateLimit} value={validateLimit}>
                  <HStack spacing='4'>
                    <span>Limit:</span>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <HStack>
                  <div>Session ID:</div>
                  <div>
                    <Select placeholder='Select option' value={validationSession} onChange={(event) => setValidationSession(event.target.value)}>
                      {PreviousUserSessions?.map((session, ind) =>
                        <option key={ind} value={session}>{session}</option>
                      )}
                    </Select>
                  </div>
                </HStack>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel><Text as={'b'} > Practice </Text></FormLabel>
                <RadioGroup onChange={setContentPracticeLimit} value={contentPracticeLimit}>
                  <HStack spacing='4'>
                    <span>Content Limit:</span>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <RadioGroup onChange={setContentTargetLimit} value={contentTargetLimit}>
                  <HStack spacing='4'>
                    <span>Target Limit:</span>
                    <Radio value='5'>5</Radio>
                    <Radio value='10'>10</Radio>
                    <Radio value='15'>15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <HStack>
                <div>Session ID:</div>
                <div><Select placeholder='Select option' value={practiceSession} onChange={(event) => setPracticeSession(event.target.value)}>
                  {PreviousUserSessions?.map((session, ind) =>
                    <option key={ind} value={session}>{session}</option>
                  )}
                </Select></div>
              </HStack>
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex='1' textAlign='left'>
                        <Text as={'b'} >Practice config </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <ConfigForm />
                  </AccordionPanel>
                </AccordionItem>

              </Accordion>
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