import React, { Component } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import mic from '../../assests/Images/mic.png';
import stop from '../../assests/Images/stop.png';

import mic_on from '../../assests/Images/mic_on.png';

export default class AudioRecorderCompair extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }

  controlAudio(status) {
    this.setState({
      status,
    });
  }

  changeScheme(e) {
    this.setState({
      audioType: e.target.value,
    });
  }

  componentDidMount() {
    this.setState({
      audioType: 'audio/wav',
    });
  }

  render() {
    const { status, audioSrc, audioType } = this.state;
    const lang_code = localStorage.getItem('apphomelang');
    //for other language
    const audioProps = {
      audioType,
      // audioOptions: {sampleRate: 30000},
      status,
      audioSrc,
      timeslice: 1000, // timeslice
      startCallback: e => {
        this.setState({
          audioSrc: '',
        });
        this.props.setRecordedAudio('');
        console.log('succ start', e);
      },
      pauseCallback: e => {
        console.log('succ pause', e);
      },
      stopCallback: e => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });
        this.props.setRecordedAudio(temp_audioSrc);
        console.log('succ stop', e);
      },
      onRecordCallback: e => {
        console.log('recording', e);
      },
      errorCallback: err => {
        console.log('error', err);
      },
    };
    //for tamil language
    const audioProps_tamil = {
      audioType,
      // audioOptions: { sampleRate: 16000 },
      status,
      audioSrc,
      timeslice: 1000, // timeslice
      startCallback: e => {
        this.setState({
          audioSrc: '',
        });
        this.props.setRecordedAudio('');
        console.log('succ start', e);
      },
      pauseCallback: e => {
        console.log('succ pause', e);
      },
      stopCallback: e => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });
        this.props.setRecordedAudio(temp_audioSrc);
        console.log('succ stop', e);
      },
      onRecordCallback: e => {
        console.log('recording', e);
      },
      errorCallback: err => {
        console.log('error', err);
      },
    };
    return (
      <div>
        <center>
          {(() => {
            if (status == 'recording') {
              return (
                <>
                  {this.props.flag ? (
                    <img
                      src={stop}
                      className="micimg mic_record"
                      onClick={() =>
                        document.getElementById('stopaudio_compair').click()
                      }
                    ></img>
                  ) : (
                    <img
                      src={mic_on}
                      className="micimg mic_stop_record"
                      onClick={() =>
                        document.getElementById('stopaudio_compair').click()
                      }
                    ></img>
                  )}

                  {/*<p className="listen_text">Listening...</p>*/}
                </>
              );
            } else {
              return (
                <>
                  <img
                    src={mic}
                    className={'micimg mic_record'}
                    onClick={() =>
                      document.getElementById('startaudio_compair').click()
                    }
                  ></img>

                  {/*<p className="record_text">Speak and Record</p>*/}
                </>
              );
            }
          })()}
          <AudioAnalyser
            {...(lang_code === 'ta' ? audioProps_tamil : audioProps)}
            className="hide"
          >
            <div className="btn-box hide">
              <br />
              <button
                className="btn"
                id="startaudio_compair"
                onClick={() => this.controlAudio('recording')}
              >
                Start
              </button>
              <button
                className="btn"
                id="stopaudio_compair"
                onClick={() => this.controlAudio('inactive')}
              >
                Stop
              </button>
            </div>
          </AudioAnalyser>
        </center>
      </div>
    );
  }
}
