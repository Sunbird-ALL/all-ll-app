import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import './result.css';
import axios from 'axios';
import startIMg from '../assests/Images/hackthon-images/Star.svg';
import childrens from '../assests/Images/hackthon-images/childrens.avif'
import Modal from './Modal';
import './modal.css';


export default function Results() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [getGap, setGetGap] = useState(null);
  const [wordSentence, setWordSentence] = useState([]);

  const handlePrint = () => {
    window.print();
  };

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
  console.log(getGap);

  useEffect(() => {
    if (charactersArray?.length > 0) {
      handleWordSentence();
    }
  }, [charactersArray])

  const handleWordSentence = () => {
    // const replaceSymbols = charactersArray.
    axios
      .post(
        'https://all-content-respository-backend.onrender.com/v1/WordSentence/search',
        {
          tokenArr: charactersArray,
        }
      )
      .then(res => {
        // console.log(res.data);
        setWordSentence(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // const characterImprove = () => {
  //   const charactersToImprove = getGap
  //     ?.filter(item => item.score < 0.9)
  //     .map(item => item.character);
  //   const uniqueChars = [];
  //   charactersToImprove?.forEach(char => {
  //     if (!uniqueChars?.includes(char)) {
  //       uniqueChars?.push(char);
  //     }
  //   });
  //   return uniqueChars?.join(',');
  // };
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

    const sixWordGroups = [];
    for (let i = 0; i < uniqueChars.length; i += 6) {
      sixWordGroups.push(uniqueChars.slice(i, i + 6).join(','));
    }

    return sixWordGroups.join('\n');
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

  return (
    <>
      <div className="main-bg">
        <section class="c-section">
          <div class="container1">
            <div class="row">

              <div className='col s8'>
                <div class="bg-image">
                  <div class="content">
                    <h1>Congratulations...</h1>
                    <br />
                    <h4>Coins earned : {stars} <img src={startIMg} /> </h4>
                    <br />
                    <button className='btn btn-success' onClick={openModal}>Share With Teachers</button>
                    <br />
                    <button className='btn btn-info'>
                      Improve Further
                    </button>
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