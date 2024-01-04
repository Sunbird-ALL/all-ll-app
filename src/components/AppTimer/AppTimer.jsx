import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { end } from '../../services/telementryService';

const AppTimer = ({isLoggedIn, setIsLoggedIn}) => {
  
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    let interval;

    if (isLoggedIn) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);


  const handleLogout = () => {
    setIsLoggedIn(false);
    const progressData = JSON.parse(localStorage.getItem('progressData'))
    localStorage.removeItem("virtualID");
    if(progressData && progressData[localStorage.getItem('practiceSession')]?.progressPercent){
      end({"summary": [{progress: progressData[localStorage.getItem('practiceSession')]?.progressPercent}], duration: timer });
    }
    else{
      end({})
    }
    navigate('/Login')
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
<div style={{  position:'absolute', top:'55px', right:'5px', textAlign: 'right', fontSize: '24px', fontWeight: 'bold', padding: '10px' }}>
      {isLoggedIn && (
        <div>
          <p>Timer: {formatTime(timer)}</p>
          <button style={{ padding: '8px', fontSize: '14px', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AppTimer;
