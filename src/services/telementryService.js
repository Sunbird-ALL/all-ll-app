import React from 'react';
import { generateUUID, uniqueId } from './utilService';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';

let contentSessionId;
let playSessionId;

let config;
let telemetryObject = {
  id: {},
  type: 'Content',
  ver: '1.0',
  rollup: {},
};
let contextdata = {
  sid: process.env.REACT_APP_sid,
  uid: 'anonymous', // Current logged in user id
  channel: process.env.REACT_APP_channel,
  pdata: {
    // optional
    id: process.env.REACT_APP_id, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
    ver: process.env.REACT_APP_ver, // Version of the App
    pid: process.env.REACT_APP_pid, // Optional. In case the component is distributed, then which instance of that component
  },
  endpoint: '',
}   
contentSessionId = uniqueId();

export const initialize = ({ context, config, metadata }) => {
  context = context;
  config = config;
  playSessionId = uniqueId();

  if (!CsTelemetryModule.instance.isInitialised) {
    CsTelemetryModule.instance.init({});
    const telemetryConfig = {
      config: {
        pdata: context.pdata,
        env: 'contentplayer',
        channel: context.channel,
        did: context.did,
        authtoken: context.authToken || '',
        uid: context.uid || '',
        sid: context.sid,
        batchsize: 1,
        mode: context.mode,
        host: context.host || '',
        apislug: '/telemetry/',
        endpoint: context.endpoint || '/data/v3/telemetry',
        tags: context.tags,
        cdata: [
          { id: contentSessionId, type: 'ContentSession' },
          { id: playSessionId, type: 'PlaySession' },
          { id: '2.0', type: 'PlayerVersion' },
        ],
      },
      userOrgDetails: {},
      dispatcher: {},
    };
    if (context.dispatcher) {
      telemetryConfig.config.dispatcher = context.dispatcher;
    }
    CsTelemetryModule.instance.telemetryService.initTelemetry(telemetryConfig);
  }

  telemetryObject = {
    id: metadata.identifier,
    type: 'Content',
    ver: metadata.pkgVersion + '' || '1.0',
    rollup: context.objectRollup || {},
  };
  return telemetryObject;
};

export const start = (duration) => {  
  CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
    options: getEventOptions(contextdata,telemetryObject),
    edata: {
      type: 'content',
      mode: 'play',
      stageid: '',
      duration: Number((duration / 1e3).toFixed(2)),
    },
  });
};

export const response = (context, options) => {
  CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry({
    edata: {
      context
    },
  });
};

export const end = () => {
  CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
    edata: {
      type: 'content',
      mode: 'play',
      pageid: 'sunbird-player-Endpage',
      summary: [],
      duration: '000',
    },
    options: getEventOptions(),
  });
};

export const interact = (id) => {
  CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
    edata: { type: 'TOUCH', subtype: '', id, pageid: "langlab.portal" },
    
  });
};

export const search = id => {
  CsTelemetryModule.instance.telemetryService.raiseSearchTelemetry({
    options: getEventOptions(),
    edata: {
      // Required
      type: 'content', // Required. content, assessment, asset
      query: id, // Required. Search query string
      filters: {}, // Optional. Additional filters
      sort: {}, // Optional. Additional sort parameters
      correlationid: '', // Optional. Server generated correlation id (for mobile app's telemetry)
      size: 0, // Required. Number of search results
      topn: [{}], // Required. top N (configurable) results with their score
    },
  });
};

export const impression = currentPage => {
  CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
    options: getEventOptions(),
    edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' },
  });
};

export const error = (error, data) => {
  CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
    options: getEventOptions(),
    edata: {
      err: data.err,
      errtype: data.errtype,
      stacktrace: error.toString() || '',
    },
  });
};

export const getEventOptions = (contextdata,telemetryObject) => {
  return {
    object: telemetryObject,
    context: {
      channel: contextdata.channel,
      pdata: contextdata.pdata,
      env: 'contentplayer',
      sid: contextdata.sid,
      uid: contextdata.uid,
      cdata: [
        { id: contentSessionId, type: 'ContentSession' },
        { id: playSessionId, type: 'PlaySession' },
        { id: '2.0', type: 'PlayerVersion' },
      ],
      rollup: contextdata.contextRollup || {},
    },
  };
};
