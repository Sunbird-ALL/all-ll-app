import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, json, useNavigate } from 'react-router-dom';
import './result.css';
import axios from 'axios';
import StartPng from '../assests/Images/Star.svg'

export default function Results() {
  const [getGap, setGetGap] = useState(null);
  const [wordSentence, setWordSentence] = useState([]);
  const [isCalled,setIsCalled] = useState(0)

  useEffect(() => {
    fetch(
      `https://telemetry-dev.theall.ai/learner/scores/GetGaps/session/${localStorage.getItem(
        'virtualStorySessionID'
      )}`
    )
      .then(response => response.text())
      .then(async result => {
        var apiResponse = JSON.parse(result);
        setGetGap(apiResponse);
      
      });
    GetRecommendedWordsAPI();
  }, []);

  // console.log(getGap);
  const charactersArray = getGap?.map(item => item.character);
  // console.log(getGap);

  useEffect(()=>{
    if (charactersArray?.length>0 && isCalled === 0){
      handleWordSentence();
      setIsCalled(isCalled+1)
    }
  },[charactersArray])

  const handleWordSentence = () => {
    // const replaceSymbols = charactersArray.
    axios
      .post(
        'https://telemetry-dev.theall.ai/content-service/v1/WordSentence/search',
        {
          tokenArr: charactersArray,
        }
      )
      .then(res => {

        setWordSentence(res.data);

        localStorage.removeItem('content_random_id');
        localStorage.setItem('content_random_id', -1);
        localStorage.setItem('pageno',1);
        let contentdata = []
         res.data.data.forEach((element, index) => {
           let contentObj = {};
           contentObj.title = element.title
           contentObj.type = element.type
           contentObj.hi = element.data[0].hi
           // contentObj.en = element.data[0]
           contentObj.image = element.image
           contentdata[index] = contentObj;
          });
          
          
          localStorage.setItem('apphomelevel','Word');
          localStorage.setItem('contents', JSON.stringify(contentdata));
          
        // let data = null;
        // data = JSON.parse(JSON.stringify(contentdata));
        // console.log(data);
        // console.log(res.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  // console.log(wordSentence)
  const characterImprove = () => {
    const charactersToImprove = getGap
      ?.filter(item => item.score < 0.9)
      .map(item => item.character);
    const uniqueChars = [];
    charactersToImprove?.forEach(char => {
      if (!uniqueChars?.includes(char)) {
        uniqueChars?.push(char);
      }
    });
    return uniqueChars?.join(',');
  };

  const [stars, setStars] = useState(0);

  const GetRecommendedWordsAPI = () => {
    // const currentSentence = localStorage.getItem('contentText');
    // const splitSentence = currentSentence.split('');
    // console.log(splitSentence.length);

    fetch(
      `https://telemetry-dev.theall.ai/learner/scores/GetRecommendedWords/session/${localStorage.getItem(
        'virtualStorySessionID'
      )}`
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        // console.log(data);
        setStars(data.length);
      });
  };

  const [showMore,setShowMore] = useState(false)
const[counter,setCounter] = useState(20)

const [visitorCount, setVisitorCount] = useState(0); // Initialize with 0
const targetCount = stars; // The target visitor count

useEffect(() => {
  const incrementVisitorCount = () => {
    if (visitorCount < targetCount) {
      setVisitorCount((prevCount) => prevCount + 1);
    }
  };

  // Set up an interval to increment the count every 1 second (adjust as needed)
  const intervalId = setInterval(incrementVisitorCount, 30);

  return () => {
    // Clean up the interval when the component unmounts
    clearInterval(intervalId);
  };
}, [visitorCount, targetCount]);

  return (
    <>
      <section class="c-section">
        <h1 style={{ color: 'white' }}>You Earned Stars: {visitorCount} <img style={{height:'20px'}} src={StartPng} alt=''/></h1>
        <h2 class="c-section__title">
          <span>Congratulations</span>
          {/* <button onClick={handleWordSentence}>Click</button> */}
        </h2>
        <ul class="c-services">
          <li class="c-services__item">
        <h1>Recommended Words and Senteces</h1>
        <Link to={'/exploreandlearn/startlearn'}>
         <button>Let's Improve</button>
        </Link>
              {wordSentence.data?.length>0 &&  wordSentence?.data.map((item, ind) => {
                // console.log(item?.data[0]?.hi?.text);
                return (
                  <>
                    <h2>{item?.data[0]?.hi?.text}</h2>
                  </>
                );
              })}
          </li>
        </ul>
      </section>
      <div>
        <section class="c-section">
          <ul class="c-services">
            { showMore?
<>
              <h2 style={{color:'black'}} class="b-section__title"> Your Results</h2>
            <li class="c-services__item">
              <h3>Characters to improve: {characterImprove()}</h3>
              {getGap?.map((data, index) => (
                <div>
                  <br></br>
                  <h4 style={{display:'flex', gap:'10px'}}>This character <h1 style={{fontSize:'24px'}}>
                    {data.character} 
                    </h1> 
                    needs improvement</h4>
                 score: {data.score}
                  <hr></hr>
                </div>
              ))}
            </li>
</>:""
            }
          </ul>
              <button style={{backgroundColor:'white', padding:'5px', border:'none', boxShadow:'2px 2px 10px 2px grey'}} onClick={()=> setShowMore(!showMore)}> {!showMore? "Show Details":"Hide Details"} </button>
             
        </section>
      </div>
    </>
  );
}
