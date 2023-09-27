import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

const StoryList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
     fetchApi();
  }, []);
  
  const fetchApi = async () => {
    try {
      const response = await fetch('https://all-content-respository-backend.onrender.com/v1/collection');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  const selectStoryTitle = (storyTitle,index) =>{
    localStorage.setItem('storyTitle', storyTitle)
  }
      return (
        <div className="container">
        <div className="row">
          <h1 style={{textAlign:'center'}}>My Stories</h1>
          {posts?.data?.map((post,ind) => (
            <Link to={`story/${post.collectionId}`} key={ind} >
             <Box
             borderWidth="1px"
             borderRadius="10px"
             overflow="hidden"
             width="350px"
             backgroundColor="white"
             margin= "2% 5% 0% 0%"
             display={"inline-block"}
             boxShadow="md"
             _hover={{ boxShadow: "lg" }}
             onClick={()=> selectStoryTitle(post.title)}
             >
             <Image src={post.image} alt={post.title} width="100%" height="auto" />
             <Box textAlign={'center'} p="4">
                 <Text fontSize="xl" fontWeight="bold" lineHeight="1.1" mb="2">
                   {post.title}
                 </Text>
             </Box>
           </Box>
            </Link>
          ))}
        </div>
      </div>
  )
}

export default StoryList