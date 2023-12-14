import React, { Component } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import mic from '../../assests/Images/mic.png';
import mic_on from '../../assests/Images/mic_on.png';
import mic_play from '../../assests/Images/mic_play.svg';

export default class AudioRecorderCompair extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }

  controlAudio(status) {
    if (this?.props?.isAudioPlay) this?.props?.isAudioPlay(status);
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
        // console.log('succ start', e);
      },
      pauseCallback: e => {
        // console.log('succ pause', e);
      },
      stopCallback: e => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });
        localStorage.setItem('recordedAudio',temp_audioSrc)
        this.props.setRecordedAudio(temp_audioSrc);

        const reader = new FileReader();
        reader.readAsDataURL(e);
        reader.onloadend = () => {
        var base64Data = reader.result.split(',')[1];
        localStorage.setItem('recordedAudio',temp_audioSrc)
        this.props.saveIndb(base64Data)
        };
      },
      onRecordCallback: e => {
        // console.log('recording', e);
      },
      errorCallback: err => {
        // console.log('error', err);
      },
      height: 300,
      width: 250,
      backgroundColor:"hsla(0, 100%, 0%, 0)",
      strokeColor:"red",
      className:"test",

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
      },
      pauseCallback: e => {
        console.log('succ pause', e);
      },
      stopCallback: e => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });
        const reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onloadend = () => {
      var base64Data = reader.result.split(',')[1];
      // console.log(base64Data);
      // getASROutput(base64Data, blob);
      localStorage.setItem('recordedAudio',temp_audioSrc)
      this.props.saveIndb(base64Data)
    };
        this.props.setRecordedAudio(temp_audioSrc);
      },
      onRecordCallback: e => {
        // console.log('recording', e);
      },
      errorCallback: err => {
        console.log('error', err);
      },
      height: 300,
      width: 250,
      backgroundColor:"hsla(0, 100%, 0%, 0)",
      strokeColor:"red",
      className:"test",
    };
    return (
      <div>
         <div className='custom-design'>
            <div
           
              className={status === 'recording' ? 'dis-visible' : 'dis-none'}
            >
              <AudioAnalyser {...audioProps}></AudioAnalyser>
            </div>
          </div>
        <center>
          {(() => {
            if (status === 'recording') {
              return (
                <>
                    {this.props.flag ? (
                    <>
                      <img
                        src={mic_play}
                        style={{ height: '72px', width: '72px' }}
                        className="micimg mic_stop_record"
                        onClick={() =>
                          document.getElementById('stopaudio_compair').click()
                        }
                      />
                       {/* <h4 className="text-speak m-0">Stop</h4> */}
                    </>
                  ) : (
                    <>
                      <img
                        src={mic}
                        style={{ height: '72px', width: '72px' }}
                        className="micimg mic_stop_record"
                        onClick={() =>
                          document.getElementById('stopaudio_compair').click()
                        }
                      />  
                     
                    </>
                  )}
         
                </>
              );
            } else {
              return (
                <>
                  <img
                    src={mic}
                    style={{ height: '72px', width: '72px' }}
                    className={'micimg mic_record'}
                    onClick={() =>
                      document.getElementById('startaudio_compair').click()
                    }
                  ></img>

                  {/* <h4 className="record_text text-speak m-0">Stop</h4> */}
                  {/* <h4 className="text-speak m-0">Speak</h4> */}
                </>
              );
            }
          })()}
          <AudioAnalyser
            {...(lang_code === 'kn' || lang_code ===  'ta' ? audioProps_tamil : audioProps)}
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
