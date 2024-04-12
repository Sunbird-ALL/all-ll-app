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
  Switch,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import Children from '../../assests/Images/children-thumbnail.png';
import ConfigForm from '../../config/ConfigForm';
import { useNavigate } from 'react-router-dom';
import { fetchPointerApi } from '../../utils/api/PointerApi';

function AppDrawer({ forceRerender, setForceRerender, setCurrentWordIndex ,setCompletionCriteriaIndex }) {
  const navigate = useNavigate()
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
  const [isDiscoveryEnabled, setDiscoveryStatus] = React.useState(localStorage.getItem('userCurrentLevel') === 'm0' ? true : false );
  const [isAudioPreprocessingEnabled, setAudioPreprocessingStatus] = React.useState(false);
  const [isLargerThan865] = useMediaQuery('(min-width: 865px)');
  const [lessonRec,setLessonRec] = React.useState('discoverylist')
  const [lesson,setLesson] = React.useState(0)

  React.useEffect(() => {
    if (localStorage.getItem('isAudioPreprocessing') !== null) {
      if (localStorage.getItem('isAudioPreprocessing') === 'true') {
        setAudioPreprocessingStatus(true);
      } else {
        setAudioPreprocessingStatus(false);
      }
    } else {
      if (process.env.REACT_APP_IS_AUDIOPREPROCESSING === 'true') {
        setAudioPreprocessingStatus(true);
      } else {
        setAudioPreprocessingStatus(false);
      }
    }
  }, []);

  const handleLocalStorageValue = ()=>{
    localStorage.setItem('apphomelang', value);
    localStorage.setItem('validateLimit', validateLimit);
    localStorage.setItem('discoveryLimit', discoveryLimit);
    localStorage.setItem('contentPracticeLimit', contentPracticeLimit);
    localStorage.setItem('contentTargetLimit', contentTargetLimit);
    localStorage.setItem('isAudioPreprocessing', isAudioPreprocessingEnabled ? true : false);
    localStorage.setItem('discoveryStatus', isDiscoveryEnabled ? 'enabled' : 'disabled');
    localStorage.setItem('userCurrentLevel', level)
    localStorage.setItem('validationSession', validationSession);
    localStorage.setItem('practiceSession', practiceSession);
  }

  const handleModalCloseWithoutSave = ()=>{
    setValue(localStorage.getItem('apphomelang'))
    setValidateLimit(localStorage.getItem('validateLimit'))
    setDiscoveryLimit(localStorage.getItem('discoveryLimit'));
    setContentPracticeLimit(localStorage.getItem('contentPracticeLimit'));
    setContentTargetLimit(localStorage.getItem('contentTargetLimit'));
    setAudioPreprocessingStatus(localStorage.getItem('isAudioPreprocessing') === 'true'?true:false);
    setDiscoveryStatus(localStorage.getItem('discoveryStatus') === 'enabled'? true : false);
    setLevel(localStorage.getItem('userCurrentLevel'));
    setPracticeSession(localStorage.getItem('practiceSession'))
    setValidationSession(localStorage.getItem('validationSession'));
  }


  React.useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/getMilestone/user/${localStorage.getItem('virtualID')}?language=${value}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          setLevel(data?.data?.milestone_level);
          localStorage.setItem('userCurrentLevel', data?.data?.milestone_level)
        });
    } catch (error) {
      console.error(error.message);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lais/scores/GetSessionIds/${localStorage.getItem('virtualID')}`
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

    const fetchDataFromApi = async (lang) => {
        try {
          const result = await fetchPointerApi(lang);
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

      const handleNavigate = (lessonRec) => {
        if (lessonRec) {
          if (lessonRec === 'showcase') {
            navigate(`/showcase`);
          } else if (lessonRec === 'practice') {
            navigate(`/practice`);
          } else if (lessonRec === 'validate') {
            localStorage.setItem('validationSession', lesson);
            navigate(`/validate`);
          } else {
            navigate(`/${lessonRec}`);
          }
        }
      };

      const handleGetLesson = () => {
        fetch(
          `${
            process.env.REACT_APP_LEARNER_AI_APP_HOST
          }/lp-tracker/api/lesson/getLessonProgressByUserId/${localStorage.getItem(
            'virtualID'
          )}?language=${value}`
        )
          .then(res => {
            return res.json();
          })
          .then(data => {
            setLessonRec(data?.result?.result?.milestone || 'discoverylist');
            setLesson(data?.result?.result?.lesson || 0)
            setLevel(data?.result?.result?.milestoneLevel || 'm0');
            localStorage.setItem('userCurrentLevel', data?.result?.result?.milestoneLevel || 'm0')
            setCompletionCriteriaIndex(parseInt(data?.result?.result?.lesson) || 0)
            setCurrentWordIndex(0) 
            localStorage.setItem(
              'userPracticeState',
              data?.result?.result?.lesson || 0
            );
            localStorage.setItem(
              'lessonProgressPercent',
              data?.result?.result?.progress || 0
            );
            handleNavigate(data?.result?.result?.milestone || 'discoverylist')
            fetchDataFromApi(value)
          });
      };

  const handleSave = () => {
    onClose();
    handleGetLesson()
    setForceRerender(!forceRerender);
    handleLocalStorageValue()
  };
  return (
    <>
      <Button
        className="btn btn-success"
        variant={'solid'}
        colorScheme={'teal'}
        onClick={onOpen}
        mr={4}
        ref={btnRef}
        rightIcon={<Avatar size={'sm'} src={Children} />}
      >
        {isLargerThan865
          ? `My Profile : ${localStorage.getItem('virtualID')}`
          : `P : ${localStorage.getItem('virtualID')}`}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
          handleModalCloseWithoutSave();
        }}
        size={'md'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top={'-2'} size="sm" />
          <DrawerHeader borderBottomWidth="1px">Profile</DrawerHeader>

          <DrawerBody>
            <Stack spacing="4">
              <Text
                textTransform={'capitalize'}
                fontSize="lg"
                fontWeight="bold"
              >
                Hello, {localStorage.getItem('virtualID')}[{level}]
                {/* <Editable defaultValue={level}>
                  <EditablePreview />
                  <EditableInput onChange={(event) => setLevel(event.target.value)}/>
                </Editable> */}
              </Text>
              <Divider />
              <FormControl>
                <FormLabel>
                  <Text as={'b'}>Session ID</Text>
                </FormLabel>
                <Input
                  variant="filled"
                  value={localStorage.getItem('virtualStorySessionID')}
                  isReadOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  <Text as={'b'}>Language </Text>
                </FormLabel>
                <RadioGroup onChange={setValue} value={value}>
                  <HStack spacing="4">
                    <Radio value="en">English</Radio>
                    <Radio value="kn">ಕನ್ನಡ</Radio>
                    <Radio value="ta">தமிழ்</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel>
                  <Text as={'b'}>Audio Preprocessing </Text>
                </FormLabel>
                <HStack spacing="4" paddingBottom={4}>
                  <Text>
                    Audio Preprocessing{' '}
                    {isAudioPreprocessingEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Switch
                    isChecked={isAudioPreprocessingEnabled}
                    onChange={() =>
                      setAudioPreprocessingStatus(!isAudioPreprocessingEnabled)
                    }
                    colorScheme="teal"
                    size="md"
                  />
                </HStack>
                <FormLabel>
                  <Text as={'b'}>Discovery </Text>
                </FormLabel>
                <HStack spacing="4" paddingBottom={4}>
                  <Text>
                    Discovery {isDiscoveryEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Switch
                    isChecked={isDiscoveryEnabled}
                    onChange={() => setDiscoveryStatus(!isDiscoveryEnabled)}
                    colorScheme="teal"
                    size="md"
                  />
                </HStack>
                <RadioGroup onChange={setDiscoveryLimit} value={discoveryLimit}>
                  <HStack spacing="4">
                    <span>Limit:</span>
                    <Radio value="5">5</Radio>
                    <Radio value="10">10</Radio>
                    <Radio value="15">15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel>
                  <Text as={'b'}>Validation </Text>
                </FormLabel>
                <RadioGroup onChange={setValidateLimit} value={validateLimit}>
                  <HStack spacing="4">
                    <span>Limit:</span>
                    <Radio value="5">5</Radio>
                    <Radio value="10">10</Radio>
                    <Radio value="15">15</Radio>
                    <Radio value="0">ALL</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <HStack>
                  <div>Session ID:</div>
                  <div>
                    <Select
                      placeholder="Select option"
                      value={validationSession}
                      onChange={event =>
                        setValidationSession(event.target.value)
                      }
                    >
                      {PreviousUserSessions?.map((session, ind) => (
                        <option key={ind} value={session}>
                          {session}
                        </option>
                      ))}
                    </Select>
                  </div>
                </HStack>
              </FormControl>
              <Divider />
              <FormControl>
                <FormLabel>
                  <Text as={'b'}> Practice </Text>
                </FormLabel>
                <RadioGroup
                  onChange={setContentPracticeLimit}
                  value={contentPracticeLimit}
                >
                  <HStack spacing="4">
                    <span>Content Limit:</span>
                    <Radio value="5">5</Radio>
                    <Radio value="10">10</Radio>
                    <Radio value="15">15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <RadioGroup
                  onChange={setContentTargetLimit}
                  value={contentTargetLimit}
                >
                  <HStack spacing="4">
                    <span>Target Limit:</span>
                    <Radio value="5">5</Radio>
                    <Radio value="10">10</Radio>
                    <Radio value="15">15</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <HStack>
                <div>Session ID:</div>
                <div>
                  <Select
                    placeholder="Select option"
                    value={practiceSession}
                    onChange={event => setPracticeSession(event.target.value)}
                  >
                    {PreviousUserSessions?.map((session, ind) => (
                      <option key={ind} value={session}>
                        {session}
                      </option>
                    ))}
                  </Select>
                </div>
              </HStack>
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Text as={'b'}>Practice Config </Text>
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

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
                handleModalCloseWithoutSave();
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSave()} colorScheme="blue">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default AppDrawer;