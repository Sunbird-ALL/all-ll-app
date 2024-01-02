import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Center, Container, HStack, Image, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import PlaceHolder from '../../assests/Images/hackthon-images/sets.png';
import kannadaPlaceholder from '../../assests/Images/hackthon-images/knCol.png';
import Header from '../Header';
import axios from 'axios';
import { stopLoading } from '../../utils/Helper/SpinnerHandle';

const DiscoveryList = () => {
  localStorage.setItem('userPracticeState', 0)
  localStorage.setItem('firstPracticeSessionCompleted', false)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    setLoading(true)
    axios
      .post(`https://www.learnerai-dev.theall.ai/content-service/v1/content/getAssessment`, {
        "tags": ["ASER"],
        "language": localStorage.getItem('apphomelang')
      })
      .then(async response => {
        setLoading(false)
        if (!response) {
          throw new Error('Network response was not ok');
        }
        setPosts(response.data?.data);
        //localStorage.setItem('selectedStoryTitle', response.data.);
        localStorage.setItem('sentenceCounter', 0);
      })
      .catch(error => {
        setLoading(false)
        console.error(error);
        stopLoading();
      });
  }
  localStorage.setItem('storyTitle', '');

  const selectStoryTitle = (storyTitle, lang) => {
    localStorage.setItem('storyTitle', storyTitle);
    localStorage.setItem('apphomelang', lang);
  };
  return (
    <>
      <Header active={0} />
      <div className='bg'>
        <div style={{ padding: '100px 25px 5px 25px' }}>
          {
            loading ? (
              <Center h='50vh'><Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            /></Center>
            ) :
              posts?.length ?
                <SimpleGrid minChildWidth='25vh' spacing='25px'>

                  {posts?.map((post, ind) => (
                    <Box
                      onClick={() => selectStoryTitle(post.name, post.language)}
                      borderWidth="1px"
                      borderRadius="1px"
                      backgroundColor="white"
                      boxShadow="md"
                      key={ind}
                      _hover={{ boxShadow: "lg" }}
                    >
                      <Link to={`discovery/${post.collectionId}`} key={ind}>
                        {/* <Image src={post.image == " " ? post.language === 'kn' ? kannadaPlaceholder : PlaceHolder : post.image} alt={post.title} width="100%" height="auto" /> */}
                        <Image
                          src={!post.image ? post.language === 'kn' ? kannadaPlaceholder : PlaceHolder : post.image}
                          alt={post.name}
                          width="100%"
                        />
                        <Box textAlign='center'>
                          <Text fontSize="xl" fontWeight="bold" lineHeight="1.1" mb="2">
                            {post.name}
                          </Text>
                        </Box>
                      </Link>
                    </Box>
                  ))}


                </SimpleGrid>
                : <>
                  <Center>
                    <Text color='red'>
                      Data not available
                    </Text>
                  </Center>
                </>
          }
        </div>
      </div>
      {/* <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text> */}
    </>
  )
}
export default DiscoveryList;
