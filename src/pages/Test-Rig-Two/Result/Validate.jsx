import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Result.css';
import startIMg from '../../../assests/Images/hackthon-images/Star.svg';
// import Modal from './Modal';
import Modal from '../../Modal';
import axios from 'axios';
import Next from '../../../assests/Images/next.png'
// import Header from './Header';
import Header from '../../Header';
import thumbsup from '../../../assests/Images/Thumbs_up.svg';
import thumbsdown from '../../../assests/Images/Thumbs_Down.svg';
import {
  Select,
  Text,
} from '@chakra-ui/react';

export default function Validate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [isCalled, setIsCalled] = useState(0);
  const [wordSentence, setWordSentence] = useState([]);

  const openModal = () => {
    characterImprove();
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [getGap, setGetGap] = useState(null);
  console.log(getGap);
  const [sessionList, setSessionList] = useState([]);

  useEffect(() => {
    fetch(
      `https://www.learnerai-dev.theall.ai/lais/scores/GetSessionIds/${localStorage.getItem(
        'virtualID'
      )}?limit=5`
    )
      .then(response => response.text())
      .then(async result => {
        console.log(result);
        var apiResponse = JSON.parse(result);
        setSessionList(apiResponse);
        getTarget(apiResponse[0]);
      });
  }, []);

  const getTarget = myPreviousSessionId => {
    // console.log(myPreviousSessionId);
    fetch(
      `https://www.learnerai-dev.theall.ai/lais/scores/GetTargets/session/${myPreviousSessionId}`
    )
      .then(response => response.text())
      .then(async result => {
        var apiResponse = JSON.parse(result);
        setGetGap(apiResponse);
        // console.log(apiResponse);
        characterImprove();
        // handleWordSentence()
      });
    GetRecommendedWordsAPI(myPreviousSessionId);
  };

  const GetRecommendedWordsAPI = myPreviousSessionId => {
    fetch(
      `https://www.learnerai-dev.theall.ai/lais/scores/GetFamiliarity/session/${myPreviousSessionId}`
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        // console.log(data);
        setStars(data.length);
      });
  };

  const charactersArray = getGap?.map(item => item.character);
  // console.log(getGap);

  useEffect(() => {
    if (charactersArray?.length > 0 && isCalled === 0) {
      setIsCalled(isCalled + 1);
    }
  }, [charactersArray]);

  const [recommededWords, setRecommendedWords] = useState('');
  const [loding, setLoading] = useState(false);
  // console.log(recommededWords);
  const [myCurrectChar, setMyCurrentChar] = useState('');
  const handleWordSentence = char => {
    // const replaceSymbols = charactersArray.
    axios
      .post(
        'https://telemetry-dev.theall.ai/content-service/v1/WordSentence/search',
        {
          tokenArr: [char],
          // tokenArr: ["न"],
        }
      )
      .then(res => {
        setWordSentence(res.data);
        setLoading(true);
        setRecommendedWords(res.data.data);
        localStorage.removeItem('content_random_id');
        localStorage.setItem('content_random_id', -1);
        localStorage.setItem('pageno', 1);
        let contentdata = [];
        res.data.data.forEach((element, index) => {
          let contentObj = {};
          contentObj.title = element.title;
          contentObj.type = element.type;
          contentObj.hi = element.data[0].hi;
          contentObj.ta = element.data[0].ta;
          // contentObj.en = element.data[0]
          contentObj.image = element.image;
          contentdata[index] = contentObj;
        });

        localStorage.setItem('apphomelevel', 'Word');
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

  const [character, setCharacter] = useState([]);

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
    // console.log("charactersToImprove",uniqueChars?.join(','));
    setCharacter(uniqueChars);
    return uniqueChars?.join(',');
  };
  const [isCurrentCharModalOpen, SetCurrentCharModalOpen] = useState(false);

  const handleCharMopdal = () => {
    SetCurrentCharModalOpen(false);
  };

  const [selectedSessionId, setSelectedSessionId] = useState('');
  // console.log(selectedSessionId);
  const handleSessionIdChange = event => {
    getTarget(event.target.value)
    setSelectedSessionId(event.target.value);
  };

  function handelFeedBack(feedback,myCurrectChar) {
    // console.log(myCurrectChar);
    handleCharMopdal();
    if (feedback === 1) {
      alert(
        'Bingo! Your Character recognition skills are on point. Way to go!'
      );
    } else {
      alert(
        `No problem at all. Character recognition can be tricky, but you're learning!.`
      );
    }
    setIsModalOpen(true);
    axios
      .post(
        `https://www.learnerai-dev.theall.ai/lais/scores/addAssessmentInput`,
        {
          user_id: localStorage.getItem('virtualID'),
          session_id: localStorage.getItem('virtualStorySessionID'),
          token: myCurrectChar,
          feedback: feedback,
        }
      )
      .then(res => {
        // console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getGap?.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  // console.log(currentPage);

  return (
    <>
      <Header active={2} />
      {/* <button >click me</button> */}
      <div className="main-bg">
        <section className="c-section">
          <div className="container1">
            {/* <div className="">
              <div>
                <div className="">
                  <div className="content" >
                    <br />
                    <h2 style={{fontSize:'50px', position:'relative', top:'-100px', left:'10px'}}>Coins earned : {stars} <img src={startIMg} alt='start-image' /> </h2>
                    <br />
                    <button className='btn btn-success' onClick={openModal}>Share With Teachers</button>
                    <Link to={'/practice'}>
                    <button className='btn btn-info'>
                      practice
                    </button>
                    </Link>

                  </div>
                </div>
              </div>
            </div> */}

            <div className="row">
              <div className="col s6">
                {/* <Modal zIndex={5}  isOpen={isCurrentCharModalOpen} onClose={handleCharMopdal}>
                <h1 style={{textAlign:'center'}}>Do You Know This Character</h1>
                <div style={{textAlign:'center'}}>

                 <h1 style={{fontSize:'100px'}}>
                 {myCurrectChar}
                 </h1>
                </div>
                <div style={{textAlign:'center', paddingBottom:'10px'}}>
                  
                  {loding && recommededWords?.map((item,ind)=>{
                    return <div key={ind}>
                      <span style={{fontSize:'25px', margin:'10px',}}>
                   {   item?.data[0]?.ta?.text}{", "}
                      </span>
             
                    </div>
                  })}
                </div>
                <div style={{textAlign:'center'}}>
                  <img onClick={()=> {handelFeedBack(1)}} style={{marginLeft:'10px', cursor:'pointer'}} src={thumbsup} alt='thumbs-up'/>
                  <img onClick={()=> {handelFeedBack(0)}} style={{marginLeft:'10px', cursor:'pointer'}}  src={thumbsdown} alt='thumbs-down'/>
                </div>
                </Modal> */}

                {/* <Modal zIndex={1} isOpen={isModalOpen} onClose={closeModal}>
                  <table id="customers">
                    <tr>
                      <th><h4>Coins earned  </h4></th>
                      <th>{stars} <img src={startIMg} alt='start' /> 
                      </th>
                    </tr>
                    <tr>
                      <td> Sentences Spoken</td>
                      <td>
                        <h3> {localStorage.getItem("sentenceCounter")}</h3></td>
                    </tr>
                    <tr>
                      <td>Characters To Improve </td>
                      <td>
                    
                        <h3> {character?.map((item,ind)=>{
                        return  <div key={ind}>
                        <span  onClick={()=> {closeModal(); setMyCurrentChar(item); SetCurrentCharModalOpen(true); handleWordSentence(item)}}>
                          {item}
                          </span>{" "}
                          </div>
                        })}</h3></td>
                    </tr>

                  </table>
                  <br />
                  <div className='row'>
                    <div className='col s12'>
                      <button className='btn btn-success' onClick={handlePrint}>Print Result</button>
                    </div>
                  </div>
                </Modal> */}
              </div>
            </div>
            <div></div>
          </div>
        </section>
        <section className="drop-down-container">
          <div style={{textAlign:'center', fontWeight:'600'}}>
            <label htmlFor="sessionid-label">Select Session Id</label>
            {/* <br />  */}
            <select
              value={selectedSessionId}
              id='sessionid-label'
              onChange={handleSessionIdChange}
              className="session-Id-drop-down"
              placeholder="Select Session Id"
              >
              {sessionList.map((session, index) => {
                return (
                  <option key={index} value={session} >
                    {session}
                  </option>
                );
              })}
            </select>
          </div>
              {/* <h1 style={{backgroundColor:'#056f41', padding:'10px', margin:'20px', borderRadius:'10px', color:'white'}}>Character Needs to Improve </h1> */}

          <div className="sessionid-container">
            <table className="sessionid-table">
              <tr>
                <th>Character needs to be improved</th>
                <th>Score</th>
                <th className="w3-right-align">Do You Know This Character</th>
              </tr>
              {currentItems?.map((item, ind) => {
                return (
                  <>
                    {/* {console.log(item)} */}
                    <tr>
                      <td>{item.character}</td>
                      <td>{item.score}</td>
                      <td className="w3-right-align">
                        <img
                          onClick={() => {
                            handelFeedBack(1,item.character);
                          }}
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                          src={thumbsup}
                          alt="thumbs-up"
                        />
                        <img
                          onClick={() => {
                            handelFeedBack(0,item.character);
                          }}
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                          src={thumbsdown}
                          alt="thumbs-down"
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </table>
            <div className='prev_next_button_container'>
              {currentPage === 1? <img src={""} className="prev_button" onClick={handlePrevPage} disabled={currentPage === 1}  alt="" /> : <img src={Next} className="prev_button" onClick={handlePrevPage} disabled={currentPage === 1}  alt="" />}
        
            <h2 style={{backgroundColor:'white'}}>Page No: {currentPage}</h2>
        <img src={Next} className="next_button" onClick={handleNextPage} disabled={indexOfLastItem >= getGap?.length} alt="" />
        {/* <button onClick={handleNextPage} disabled={indexOfLastItem >= getGap?.length}>
          Next
        </button> */}
      </div>
          </div>
        </section>
      </div>
      <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text>
    </>
  );
}
