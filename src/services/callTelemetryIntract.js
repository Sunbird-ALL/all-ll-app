import React from 'react';
import { interact,start } from '../services/telementryService';
const duration = new Date().getTime();
export const interactCall = (telemetryMode) => {
  interact(telemetryMode)
};

export const  startEvent=()=>{
 start(
    duration
  );
}