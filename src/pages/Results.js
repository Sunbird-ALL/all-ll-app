import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import './result.css';

export default function Results() {
  const [getGap, setGetGap] = useState(null);

  useEffect(() => {
    fetch(
      `https://telemetry-dev.theall.ai/learner/scores/GetGaps/session/${localStorage.getItem("virtualStorySessionID")}`
    )
      .then((response) => response.text())
      .then(async (result) => {
        var apiResponse = JSON.parse(result);
        setGetGap(apiResponse);
      });
  }, []);

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
    <section class="c-section">
      <h2 class="c-section__title">
        <span>Your Results</span>
      </h2>
      <ul class="c-services">
      
          <li class="c-services__item" >
          <h3>Characters to improve: {characterImprove()}</h3>
          {getGap?.map((data, index) => (
            <div><br></br><h4>This character {data.character} needs improvement</h4>
            ----------Improvement score: {data.score}<hr></hr></div>
         
        ))}
         </li>
      </ul>
    </section>
  );
}
