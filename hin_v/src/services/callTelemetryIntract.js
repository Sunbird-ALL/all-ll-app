import React from 'react';
import { interact,start } from '../services/telementryService';
const duration = new Date().getTime();
export const interactCall = () => {
  interact()
};

export const  startEvent=()=>{
 start(    
    duration
  );
}