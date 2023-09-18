import React from 'react';
import { interact,start } from '../services/telementryService';
const duration = new Date().getTime();

export const interactCall = (id, uri, telemetryMode, currentPage, ) => {
  interact(id, uri, telemetryMode, currentPage)
};

export const  startEvent=(pageUrl)=>{
 start(
    duration,
    pageUrl
  );
}