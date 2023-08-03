import React from 'react';
import { interact,start } from '../services/telementryService';
const duration = new Date().getTime();
export const interactCall = (telemetryMode,id) => {
  interact(telemetryMode,id)
};

export const  startEvent=()=>{
 start(
    duration
  );
}