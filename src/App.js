import React, { useEffect } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { initialize, end } from './services/telementryService';
import '@project-sunbird/telemetry-sdk/index.js';
import { startEvent } from './services/callTelemetryIntract';
import ContentCreate from './pages/content/ContentCreate';
import Contents from './pages/content/Contents';

//components
import Dots from './components/Spinner/Dots';

import StartV3 from './pages/ExploreAndLearn/Start/Start3';
import StartLearn3 from './pages/ExploreAndLearn/StartLearn/StartLearn';
import Score3 from './pages/ExploreAndLearn/Score/Score';
import Score4 from './pages/PlayAndLearn/Score';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import StartLearn4 from './pages/PlayAndLearn/StartLearn';

function App() {
  const location = useLocation();
  let ranonce = false;



  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();

      localStorage.setItem('did', visitorId);
      initService();
    };

    setFp();


    const initService = () => {
      if (localStorage.getItem('fpDetails_v2') !== null) {
        let fpDetails_v2 = localStorage.getItem('fpDetails_v2');
        var did = fpDetails_v2.result;
      } else {
        var did = localStorage.getItem('did');
      }

      initialize({
        context: {
          mode: process.env.REACT_APP_MODE, // To identify preview used by the user to play/edit/preview
          authToken: '', // Auth key to make  api calls
          did: did, // Unique id to identify the device or browser
          uid: 'anonymous',
          channel: process.env.REACT_APP_CHANNEL, // Unique id of the channel(Channel ID)
          env: process.env.REACT_APP_env,

          pdata: {
            // optional
            id: process.env.REACT_APP_id, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: process.env.REACT_APP_ver, // Version of the App
            pid: process.env.REACT_APP_pid, // Optional. In case the component is distributed, then which instance of that component
          },
          tags: [
            // Defines the tags data
            '',
          ],
          timeDiff: 0, // Defines the time difference// Defines the object roll up data
          host: process.env.REACT_APP_host, // Defines the from which domain content should be load
          endpoint: process.env.REACT_APP_endpoint,
          apislug: process.env.REACT_APP_apislug,
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