import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { initialize, end } from './services/telementryService';
import '@tekdi/all-telemetry-sdk/index.js';
import { startEvent } from './services/callTelemetryIntract';

//components
import Dots from './components/Spinner/Dots';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import loadable from 'react-loadable'
import { getParameter } from './utils/helper';

function App() {
  const location = useLocation();
  let ranonce = false;

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();
      initService(visitorId);
    };
    setFp();

    const initService = (visitorId) => {
      initialize({
        context: {
          mode: process.env.REACT_APP_MODE, // To identify preview used by the user to play/edit/preview
          authToken: '', // Auth key to make  api calls
          did: localStorage.getItem("deviceId") || visitorId, // Unique id to identify the device or browser
          uid: 'anonymous',
          channel: process.env.REACT_APP_CHANNEL, // Unique id of the channel(Channel ID)
          env: process.env.REACT_APP_ENV,

          pdata: {
            // optional
            id: process.env.REACT_APP_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: process.env.REACT_APP_VER, // Version of the App
            pid: process.env.REACT_APP_PID, // Optional. In case the component is distributed, then which instance of that component
          },
          tags: [
            // Defines the tags data
            '',
          ],
          timeDiff: 0, // Defines the time difference// Defines the object roll up data
          host: process.env.REACT_APP_HOST, // Defines the from which domain content should be load
          endpoint: process.env.REACT_APP_ENDPOINT,
          apislug: process.env.REACT_APP_APISLUG,
        },
        config: {},
        // tslint:disable-next-line:max-line-length
        metadata: {},
      });

      if (!ranonce) {

        if (localStorage.getItem('contentSessionId') === null) {
          startEvent(location.pathname);
        }
        ranonce = true;
      }
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      // Destructure the message data
      const { messageType, localStorageKeyValue } = event.data;
      if (messageType === "customData") {
        for (const item of localStorageKeyValue) {
          const key = item.key;
          const value = item.value;

          localStorage.setItem(key, value);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      if (localStorage.getItem('contentSessionId') === null) {
        end(location.pathname);
      }
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  const LoadingComponent = ()=><h3>Loading wait....</h3>

  const StartV3 = loadable({
    loader: () => import(/* webpackChunkName: "Start3" */'./pages/ExploreAndLearn/Start/Start3'),
    loading: LoadingComponent,
  })

  const Score3 = loadable({
    loader: () => import(/* webpackChunkName: "Score3" */'./pages/ExploreAndLearn/Score/Score'),
    loading: LoadingComponent,
  })

  const StartLearn3 = loadable({
    loader: () => import(/* webpackChunkName: "StartLearn3" */'./pages/ExploreAndLearn/StartLearn/StartLearn'),
    loading: LoadingComponent,
  })

  const Score4 = loadable({
    loader: () => import(/* webpackChunkName: "Score4" */'./pages/PlayAndLearn/Score'),
    loading: LoadingComponent,
  })

  const StartLearn4 = loadable({
    loader: () => import(/* webpackChunkName: "StartLearn4" */'./pages/PlayAndLearn/StartLearn'),
    loading: LoadingComponent,
  })

  const Contents = loadable({
    loader: () => import(/* webpackChunkName: "Contents" */'./pages/content/Contents'),
    loading: LoadingComponent,
  })

  const ContentCreate = loadable({
    loader: () => import(/* webpackChunkName: "ContentCreate" */'./pages/content/ContentCreate'),
    loading: LoadingComponent,
  })


  useEffect(() => {
    let virtualId;

    if (getParameter("virtualId", window.location.hash)) {
      virtualId = getParameter("virtualId", window.location.hash);
    } else {
      virtualId = localStorage.getItem("virtualId");
    }
    localStorage.setItem("virtualId", virtualId);

    const contentSessionId = getParameter(
      "contentSessionId",
      window.location.hash
    );
    if (contentSessionId) {
      localStorage.setItem("contentSessionId", contentSessionId);
    }
    const token = getParameter("token", window.location.hash);
    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.telemetry?.syncEvents) {
        // Attempt to run syncEvents
        window.telemetry.syncEvents();
      }

      // Introduce a blocking operation for a very short delay (optional)
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Busy-wait for 100ms (not ideal, but synchronous)
      }
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  return (
    <>
      <Link to={'/exploreandlearn/score'} id="link_score_proto3" className="hide">
        score
      </Link>

      <Link to={'/playandlearn/score'} id="link_score_proto4" className="hide">
        score
      </Link>

      <Routes>
        <Route path="/content" element={<Contents />} />
        <Route path="/content/add" element={<ContentCreate />} />
        <Route path="/content/:id" element={<ContentCreate />} />

        <Route path={'/'} exact element={<StartV3/>} />
        {/* <Route path={'/*'} element={<StartV3/>} /> */}
        <Route path={'/exploreandlearn/score'} element={<Score3/>} />
        <Route path="/exploreandlearn" element={<StartV3/>} />
        <Route path={'/exploreandlearn/startlearn'} element={<StartLearn3/>} />

        <Route path={'/playandlearn/score'} element={<Score4/>} />
        <Route path="/playandlearn" element={<StartLearn4/>} />
        <Route path={'/playandlearn/startlearn'} element={<StartLearn4/>} />
      </Routes>
      <Dots />
    </>
  );
}

export default App;
