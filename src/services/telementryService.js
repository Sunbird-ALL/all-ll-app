import React from 'react';
import { generateUUID, uniqueId } from './utilService';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import jwt from 'jwt-decode';

var contentSessionId;
let playSessionId;
let url;
let config;
let isBuddyLogin = checkTokenInLocalStorage();

if (localStorage.getItem('token') !== null) {
  let jwtToken = localStorage.getItem('token');
  var userDetails = jwt(jwtToken);
  var emis_username = userDetails.emis_username;
}

function checkTokenInLocalStorage() {
  const token = localStorage.getItem('buddyToken');
  return !!token; // Returns true if token is present, false if token is null or undefined
}

if (localStorage.getItem('contentSessionId') !== null) {
  contentSessionId = localStorage.getItem('contentSessionId');
} else {
  contentSessionId =
    localStorage.getItem('virtualStorySessionID') || uniqueId();
  localStorage.setItem('allAppContentSessionId', contentSessionId);
}

let getUrl = window.location.href;
url = getUrl && getUrl.includes('#') && getUrl.split('#')[1].split('/')[1];

export const initialize = ({ context, config, metadata }) => {
  context = context;
  config = config;
  playSessionId = uniqueId();
  if (!CsTelemetryModule.instance.isInitialised) {
    CsTelemetryModule.instance.init({});
    const telemetryConfig = {
      config: {
        pdata: context.pdata,
        env: '',
        channel: context.channel,
        did: context.did,
        authtoken: context.authToken || '',
        uid: 'anonymous',
        sid: context.sid,
        batchsize: process.env.REACT_APP_BATCHSIZE,
        mode: context.mode,
        host: context.host,
        apislug: context.apislug,
        endpoint: context.endpoint,
        tags: context.tags,
        cdata: [
          { id: contentSessionId, type: 'ContentSession' },
          { id: playSessionId, type: 'PlaySession' },
        ],
      },
      userOrgDetails: {},
    };

    CsTelemetryModule.instance.telemetryService.initTelemetry(telemetryConfig);
  }
};

export const start = duration => {
  CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
    options: getEventOptions(),
    edata: {
      type: 'content',
      mode: 'play',
      stageid: url,
      duration: Number((duration / 1e3).toFixed(2)),
    },
  });
};

export const response = (context, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(
      {
        ...context,
      },
      getEventOptions()
    );
  }
};

export const end = data => {
  CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
    edata: {
      type: 'content',
      mode: 'play',
      pageid: url,
      summary: data?.summary || {},
      duration: data?.duration || '000',
    },
  });
};

// export const interact = (telemetryMode) => {
//   if (checkTelemetryMode(telemetryMode)) {
//     CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
//       options: getEventOptions(),
//       edata: { type: 'TOUCH', subtype: '', pageid: url },
//     });
//   }
// };

export const interact = (id, url, telemetryMode, currentPage) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: getEventOptions(),
      edata: { type: 'TOUCH', id: id, pageid: url, subtype: currentPage || '' },
    });
  }
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

export const impression = (currentPage, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
      options: getEventOptions(),
      edata: {
        type: 'workflow',
        subtype: '',
        pageid: currentPage + '',
        uri: '',
      },
    });
  }
};

export const error = (error, data, telemetryMode, contentId) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      options: getEventOptions(),
      edata: {
        pageid: contentId ? contentId : url,
        err: data.err,
        errtype: data.errtype,
        stacktrace: error.toString() || '',
      },
    });
  }
};

export const feedback = (data, contentId, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseFeedBackTelemetry({
      options: getEventOptions(),
      edata: {
        contentId: contentId,
        rating: data,
        comments: '',
      },
    });
  }
};

function checkTelemetryMode(currentMode) {
  return (
    (process.env.REACT_APP_TELEMETRY_MODE === 'ET' && currentMode === 'ET') ||
    (process.env.REACT_APP_TELEMETRY_MODE === 'NT' &&
      (currentMode === 'ET' || currentMode === 'NT')) ||
    (process.env.REACT_APP_TELEMETRY_MODE === 'DT' &&
      (currentMode === 'ET' || currentMode === 'NT' || currentMode === 'DT'))
  );
}

export const getEventOptions = () => {
  var emis_username = 'anonymous';
  var buddyUserId = '';

  if (localStorage.getItem('token') !== null) {
    let jwtToken = localStorage.getItem('token');
    var userDetails = jwt(jwtToken);
    emis_username = userDetails.emis_username;
  }

  if (isBuddyLogin) {
    let jwtToken = localStorage.getItem('buddyToken');
    let buddyUserDetails = jwt(jwtToken);
    buddyUserId = buddyUserDetails.emis_username;
  }

  const userType = isBuddyLogin ? 'Buddy User' : 'User';
  const userId = isBuddyLogin
    ? emis_username + '/' + buddyUserId
    : emis_username || 'anonymous';

  return {
    object: {},
    context: {
      pdata: {
        // optional
        id: process.env.REACT_APP_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
        ver: process.env.REACT_APP_VER, // Version of the App
        pid: process.env.REACT_APP_PID, // Optional. In case the component is distributed, then which instance of that component
      },
      env: process.env.REACT_APP_ENV,
      uid: `${
        isBuddyLogin
          ? emis_username + '/' + buddyUserId
          : emis_username || 'anonymous'
      }`,
      cdata: [
        {
          id: localStorage.getItem('virtualStorySessionID') || contentSessionId,
          type: 'ContentSession',
        },
        { id: playSessionId, type: 'PlaySession' },
        { id: userId, type: userType },
      ],
      rollup: {},
    },
  };
};
