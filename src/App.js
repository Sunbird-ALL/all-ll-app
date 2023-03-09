import React from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import ContentCreate from './pages/ContentCreate';
import Contents from './pages/Contents';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

//components
import Spinner from './components/Spinner/Spinner';
import Dots from './components/Spinner/Dots';
//view prototype1
import HomeStudent from './views/Home/Home';
import Audio from './views/Audio/Audio';
import Speak from './views/Speak/Speak';
import Start from './views/Start/Start';
import StartLearn from './views/StartLearn/StartLearn';
import Score from './views/Score/Score';

//app views prototype2
import Home2 from './viewsProto2/Home/Home';
import Speak2 from './viewsProto2/Speak/Speak';
import Start2 from './viewsProto2/Start/Start';
import StartLearn2 from './viewsProto2/StartLearn/StartLearn';
import Score2 from './viewsProto2/Score/Score';

import ContentList from './viewsProto2/ContentList/ContentList';
import Content from './viewsProto2/Content/Content';
import Result from './viewsProto2/Result/Result';
import AddedContent from './views/AddedContent/AddedContent';

import StartV3 from './viewsProto3/Start/Start3';
import StartLearn3 from './viewsProto3/StartLearn/StartLearn';
import Score3 from './viewsProto3/Score/Score';
import Speak3 from './viewsProto3/Speak/Speak';

import StartV4 from './viewsProto4/Start/Start';
import StartLearn4 from './viewsProto4/StartLearn/StartLearn';
import Score4 from './viewsProto4/Score/Score';
import Speak4 from './viewsProto4/Speak/Speak';

function App() {
  return (
    <HashRouter>
      <Link to={'/speak'} id="link_speak" className="hide">
        speak
      </Link>
      <Link to={'/score'} id="link_score" className="hide">
        score
      </Link>

      <Link to={'/proto2/speak'} id="link_speak_proto2" className="hide">
        speak
      </Link>

      <Link to={'/proto2/score'} id="link_score_proto2" className="hide">
        score
      </Link>

      <Link to={'/proto3/score'} id="link_score_proto3" className="hide">
        score
      </Link>

      <Link to={'/proto4/score'} id="link_score_proto4" className="hide">
        score
      </Link>

      <Link to={'/proto2/result'} id="link_result_proto2" className="hide">
        result
      </Link>
      <Routes>
        <Route path="/proto2/all" element={<Home />} />
        <Route path="/content" element={<Contents />} />
        <Route path="/content/add" element={<ContentCreate />} />
        <Route path="/content/:id" element={<ContentCreate />} />

        {/*<Route path={'/*'} element={<HomeStudent />} />*/}
        <Route path={'/*'} element={<Start />} />
        <Route path={'/speak'} element={<Speak />} />
        <Route path={'/start'} element={<Start />} />
        <Route path={'/startlearn'} element={<StartLearn />} />
        <Route path={'/score'} element={<Score />} />

        {/*<Route path={'/proto2/*'} element={<Home2 />} />*/}
        <Route path={'/proto2/*'} element={<Start2 />} />
        <Route path={'/proto2/speak'} element={<Speak2 />} />
        <Route path={'/proto2/start'} element={<Start2 />} />
        <Route path={'/proto2/startlearn'} element={<StartLearn2 />} />
        <Route path={'/proto2/score'} element={<Score2 />} />

        <Route path={'/proto2/contentlist'} element={<ContentList />} />
        <Route path={'/proto2/contentstudy/:id'} element={<Content />} />
        <Route path={'/proto2/result'} element={<Result />} />

        <Route path={'/audio'} element={<Audio />} />
        <Route path={'/addedcontent'} element={<AddedContent />} />

        <Route path={'/proto3/score'} element={<Score3 />} />
        <Route path="/proto3/all" element={<StartV3 />} />
        <Route path={'/proto3/startlearn'} element={<StartLearn3 />} />
        <Route path={'/proto3/speak'} element={<Speak3 />} />

        <Route path={'/proto4/score'} element={<Score4 />} />
        <Route path="/proto4/all" element={<StartLearn4 />} />
        <Route path={'/proto4/startlearn'} element={<StartLearn4 />} />
        <Route path={'/proto4/speak'} element={<Speak4 />} />
      </Routes>
      <Dots />
      {/* <Spinner /> */}
    </HashRouter>
  );
}

export default App;
