import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Result.css';
import startIMg from '../../../assests/Images/hackthon-images/Star.svg'
// import Modal from './Modal';
import Modal from '../../Modal';
import axios from 'axios';
// import Header from './Header';
import Header from '../../Header';
import thumbsup from '../../../assests/Images/Thumbs_up.svg'
import thumbsdown from '../../../assests/Images/Thumbs_Down.svg'
import { Center, Container, Flex, Spinner, Text, VStack } from '@chakra-ui/react';

export default function Validate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrentCharModalOpen, SetCurrentCharModalOpen] = useState(false);
  const [recommededWords, setRecommendedWords] = useState("")
  const [loding, setLoading] = useState(true);
  const [myCurrectChar, setMyCurrentChar] = useState('')
  const [chars, setCharacter] = useState([])
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const handleNext = () => {
    setTimeout(() => {
      const charIndex = currentCharIndex + 1;
      setCurrentCharIndex(charIndex);
      const latestChar = chars[charIndex];
      setMyCurrentChar(latestChar);
    }, 100);

  };

  const handlePrevious = () => {
    setTimeout(() => {
      const charIndex = currentCharIndex - 1;
      setCurrentCharIndex(charIndex);
      const latestChar = chars[charIndex];
      setMyCurrentChar(latestChar);
    }, 100);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!chars.length) {
      setLoading(true);
      axios
        .get(
          `https://www.learnerai-dev.theall.ai/lais/scores/GetContent/word/${localStorage.getItem('virtualID')}?language=${localStorage.getItem('apphomelang')}&limit=${localStorage.getItem('validateLimit')}`,
        )
        .then(res => {
          setLoading(false);
          const targetChars = res.data.getTargetChar || [];
          setCharacter(targetChars);
          setCurrentCharIndex(0);
          setMyCurrentChar(targetChars[0]);
          setRecommendedWords(res.data.contentForToken || []);
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        });
    }
  }, []);

  const handleCharMopdal = () => {
    SetCurrentCharModalOpen(false)
  }

  function handelFeedBack(feedback) {
    handleCharMopdal()
    if (feedback === 1) {
      alert("Bingo! Your Character recognition skills are on point. Way to go!")
    }
    else {
      alert(`No problem at all. Character recognition can be tricky, but you're learning!.`)
    }
    setIsModalOpen(true);
    axios
      .post(`https://www.learnerai-dev.theall.ai/lais/scores/addAssessmentInput`, {
        user_id: localStorage.getItem('virtualID'),
        session_id: localStorage.getItem('virtualStorySessionID'),
        token: myCurrectChar,
        feedback: feedback,
      })
      .then(res => {
        // console.log(res);

      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <Header active={1} />
      {/* <button >click me</button> */}
      <div className="main-bg">
      {loding && <Center h='50vh'><Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            /></Center>}
        {chars.length ? <VStack>
          <Container>
            <Center>
              <div className='col s6'>
                <h1 style={{ textAlign: 'center' }}>Do You Know This Character</h1>
                <div style={{ position: 'relative' }}>
                  {currentCharIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      style={{
                        backgroundColor: '#3498db',
                        color: '#fff',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: '20%',
                        fontSize: 'x-large',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      {'<'}
                    </button>
                  )}
                  {
                    <Center h="35vh">
                      <h1 style={{ textAlign: 'center', fontSize: '100px' }}>{myCurrectChar}</h1>
                    </Center>
                  }
                  {currentCharIndex < chars.length - 1 &&
                    <button
                      onClick={handleNext}
                      style={{
                        backgroundColor: '#3498db',
                        color: '#fff',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '20%',
                        top: '50%',
                        fontSize: 'x-large',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      {'>'}
                    </button>}
                </div>
                <div style={{ textAlign: 'center', paddingBottom: '10px', width: '100vh' }}>
                  {recommededWords[myCurrectChar].length > 0 &&
                    <span style={{ fontSize: '25px' }}>
                      {recommededWords[myCurrectChar].map((item, ind, arr) => (
                        <span key={ind}>
                          {item?.contentSourceData[0]?.text}
                          {ind !== arr.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  }
                </div>
                <Center style={{ textAlign: 'center' }}>
                  <img onClick={() => { handelFeedBack(1) }} style={{ marginLeft: '10px', cursor: 'pointer' }} src={thumbsup} alt='thumbs-up' />
                  <img onClick={() => { handelFeedBack(0) }} style={{ marginLeft: '10px', cursor: 'pointer' }} src={thumbsdown} alt='thumbs-down' />
                </Center>
              </div>
            </Center>
          </Container>
          <section className="c-section">
            <Link to={'/practice'}>
              <button className='btn btn-info'>
                Practice {'>'}
              </button>
            </Link>
          </section>
        </VStack> : !loding && 
          <>
            <Center>
              No character available to validate
            </Center>
            <section className="c-section">
              <Link to={'/discoveryList'}>
                <button className='btn btn-info'>
                  Discover {'>'}
                </button>
              </Link>
            </section>
          </>
        }
      </div>

      {/* <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text> */}

    </>
  );
}