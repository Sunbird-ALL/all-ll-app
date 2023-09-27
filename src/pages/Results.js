import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, json, useNavigate } from 'react-router-dom';
import './result.css';
import startIMg from '../assests/Images/hackthon-images/Star.svg';
import Modal from './Modal';
import axios from 'axios';
import Header from './Header';


export default function Results() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stars, setStars] = useState(0);
 const [isCalled,setIsCalled] = useState(0)
 const [wordSentence, setWordSentence] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const handlePrint = () =>{
    window.print();
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [getGap, setGetGap] = useState(null);

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
      ?.filter((item) => item.score < 0.9)
      .map((item) => item.character);
    const uniqueChars = [];
    charactersToImprove?.forEach((char) => {
      if (!uniqueChars?.includes(char)) {
        uniqueChars?.push(char);
      }
    });
    return uniqueChars?.join(',');
  };

  return (
    <>
    <Header/>
      <div className="main-bg">
        <section class="c-section">
          <div class="container1">
            <div class="row">
              <div className='col s8'>
              {/* <Link to={'/storylist'}>
  <button className='btn btn-info'>

  Practice another Story
  </button>
</Link> */}
                <div class="bg-image">
                  <div class="content">
                    <h1>Congratulations...</h1>
                    <br />
                    <h4>Coins earned : {stars} <img src={startIMg} /> </h4>
                    <br />
                    <button className='btn btn-success' onClick={openModal}>Share With Teachers</button>
                    <br />
                    <Link to={'/exploreandlearn/startlearn'}>
                    <button className='btn btn-info'>
                      Improve Further
                    </button>
                    </Link>

                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div className='col s6'>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <table id="customers">
                    <tr>
                      <th><h4>Coins earned  </h4></th>
                      <th>{stars} <img src={startIMg} /> </th>
                    </tr>
                    {/* <tr>
                      <td>Recommended Sentece </td>
                      <td> {wordSentence.data?.length > 0 && wordSentence?.data.map((item, ind) => {
                        return (
                          <>
                            <p>{item?.data[0]?.hi?.text}</p>
                          </>
                        );
                      })}</td>
                    </tr> */}
                    <tr>
                      <td> Sentences Spoken</td>
                      <td>
                        <h3> {localStorage.getItem("sentenceCounter")}</h3></td>
                    </tr>
                    <tr>
                      <td>Characters To Improve </td>
                      <td>
                        <h3> {characterImprove()}</h3></td>
                    </tr>

                  </table>
                  <br />
                  <div className='row'>
                    <div className='col s12'>
                      <button className='btn btn-success' onClick={handlePrint}>Print Result</button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <div>
              
            </div>
          </div>
        </section>
        <div>
        </div>
      </div>
    </>
  );
}