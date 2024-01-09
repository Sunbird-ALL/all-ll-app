import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, json, useNavigate } from 'react-router-dom';
import './result.css';
import startIMg from '../assests/Images/hackthon-images/Star.svg';
import Modal from './Modal';
import axios from 'axios';
import Header from './Header';
import thumbsup from '../assests/Images/Thumbs_up.svg'
import thumbsdown from '../assests/Images/Thumbs_Down.svg'
import { Text } from '@chakra-ui/react';


export default function Results() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stars, setStars] = useState(0);
 const [isCalled,setIsCalled] = useState(0)
 const [wordSentence, setWordSentence] = useState([]);

  const openModal = () => {
    characterImprove();
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
      `https://www.learnerai-dev.theall.ai/lais/scores/GetTargets/session/${localStorage.getItem(
        'virtualStorySessionID'
      )}`
    )
      .then(response => response.text())
      .then(async result => {
        var apiResponse = JSON.parse(result);
        setGetGap(apiResponse);
        // console.log(apiResponse);
        characterImprove();
        // handleWordSentence()

      });
    GetRecommendedWordsAPI();
  }, []);
  const GetRecommendedWordsAPI = () => {
    // const currentSentence = localStorage.getItem('contentText');
    // const splitSentence = currentSentence.split('');
    // console.log(splitSentence.length);

    fetch(
      `https://www.learnerai-dev.theall.ai/lais/scores/GetFamiliarity/session/${localStorage.getItem(
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


  const charactersArray = getGap?.map(item => item.character);
  // console.log(getGap);

  useEffect(()=>{
    if (charactersArray?.length>0 && isCalled === 0){
      
      setIsCalled(isCalled+1)
    }
  },[charactersArray])

  const [recommededWords,setRecommendedWords] = useState("")
  const [loding,setLoading] = useState(false);
  // console.log(recommededWords);
  const[myCurrectChar,setMyCurrentChar] = useState('')
  const handleWordSentence = (char) => {
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
        // console.log(res.data.data[0].data[0].hi.text);
        setLoading(true)
        setRecommendedWords(res.data.data)
        localStorage.removeItem('content_random_id');
        localStorage.setItem('content_random_id', -1);
        localStorage.setItem('pageno',1);
        let contentdata = []
         res.data.data.forEach((element, index) => {
           let contentObj = {};
           contentObj.title = element.title
           contentObj.type = element.type
           contentObj.hi = element.data[0].hi
           contentObj.ta = element.data[0].ta
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

  const[character,setCharacter] = useState([])

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
    // console.log("charactersToImprove",uniqueChars?.join(','));
    setCharacter(uniqueChars)
    return uniqueChars?.join(',');
  };
const [isCurrentCharModalOpen,SetCurrentCharModalOpen] = useState(false);

const handleCharMopdal=()=>{
  SetCurrentCharModalOpen(false)
}

// console.log(myCurrectChar);

function handelFeedBack(feedback) {
  handleCharMopdal()
if(feedback === 1){
  alert("Bingo! Your Character recognition skills are on point. Way to go!")
}
else{
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
   <Header  active={2}/>
    {/* <button >click me</button> */}
      <div className="main-bg">
        <section className="c-section">
          <div className="container1">
            
                  <div className="content" >
                    <h1 style={{ position:'relative', top:'-250px'}}>Congratulations...</h1>
                    <br />
                    <h2 style={{fontSize:'50px', position:'relative', top:'-100px', left:'10px'}}>Coins earned : {stars} <img src={startIMg} alt='start-image' /> </h2>
                    <br />
                    <button className='btn btn-success' onClick={openModal}>Share With Teachers</button>
                    {/* <br /> */}
                    <Link to={'/exploreandlearn/startlearn'}>
                    <button className='btn btn-info'>
                      Improve Further
                    </button>
                    </Link>

                  
            </div>

            <div className="row">
              <div className='col s6'>

              <Modal zIndex={5}  isOpen={isCurrentCharModalOpen} onClose={handleCharMopdal}>
                <h1 style={{textAlign:'center'}}>Do You Know This Character</h1>
                <div style={{textAlign:'center'}}>

                 <h1 style={{fontSize:'100px'}}>
                 {myCurrectChar}
                 </h1>
                </div>
                <div style={{textAlign:'center', paddingBottom:'10px'}}>
                  
                  {loding && recommededWords?.map((item,ind)=>{
                    return <>
                      <span style={{fontSize:'25px', margin:'10px',}}>
                   {   item?.data[0]?.ta?.text}{", "}
                      </span>
             
                    </>
                  })}
                </div>
                <div style={{textAlign:'center'}}>
                  <img onClick={()=> {handelFeedBack(1)}} style={{marginLeft:'10px', cursor:'pointer'}} src={thumbsup} alt='thumbs-up'/>
                  <img onClick={()=> {handelFeedBack(0)}} style={{marginLeft:'10px', cursor:'pointer'}}  src={thumbsdown} alt='thumbs-down'/>
                </div>
                </Modal>

                <Modal zIndex={1} isOpen={isModalOpen} onClose={closeModal}>
                  <table id="customers">
                    <tr>
                      <th><h4>Coins earned  </h4></th>
                      <th>{stars} <img src={startIMg} alt='start' /> 
                      </th>
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
                    
                        <h3> {character?.map((item,ind)=>{
                        return  <>
                        <span onClick={()=> {closeModal(); setMyCurrentChar(item); SetCurrentCharModalOpen(true); handleWordSentence(item)}}>
                          {item}
                          </span>{" "}
                          </>
                        })}</h3></td>
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
      <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text>
            
    </>
  );
}