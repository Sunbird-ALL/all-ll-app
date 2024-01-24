import React, { Component } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import mic from '../../assests/Images/mic.png';
import mic_on from '../../assests/Images/mic_on.png';
import mic_play from '../../assests/Images/mic_play.svg';

export default class AudioRecorderCompair extends Component {
  MIN_DECIBELS = -45;  
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      soundDetected: false,
      stopDetection: false,
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
  handleMic(){
    if(this.props.isAudioPreprocessing){
      this.setState({ soundDetected: false, stopDetection: false });
      this.startSoundDetection();
      document.getElementById('startaudio_compair').click();
    }
    else{
      document.getElementById('startaudio_compair').click();
    }
  }

  handleStop() {
    if(this.props.isAudioPreprocessing){
    document.getElementById('stopaudio_compair').click();
    this.setState({ stopDetection: true });
    }else{
      document.getElementById('stopaudio_compair').click();
    }
  }

  startSoundDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.minDecibels = this.MIN_DECIBELS;
      audioStreamSource.connect(analyser);

      const bufferLength = analyser.fftSize;
      const domainData = new Uint8Array(bufferLength);

      const detectSound = () => {

        if (this.state.stopDetection) {
          return; // Stop detection if stopDetection is true
        }
        console.log(this.state.soundDetected, "detectSound");
        if (this.state.soundDetected) {
          return;
        }

        analyser.getByteTimeDomainData(domainData);

        for (let i = 0; i < bufferLength; i++) {
          const amplitude = (domainData[i] / 140.0) - 1.0; // Normalize to [-1, 1]

          if (amplitude > 0.2) { // Adjust the threshold as needed
            this.setState({ soundDetected: true });
            // this.props.setIsEmptyAudio(true);
            break;
          }
        }

        requestAnimationFrame(detectSound);
      };

      requestAnimationFrame(detectSound);

      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

        // console.log({ soundDetected: this.state.soundDetected });
      });

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

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
        if (!this.props.isAudioPreprocessing) {
          this.props.saveIndb(base64Data);
        } else {
          if (this.state.soundDetected) {
            this.props.saveIndb(base64Data);
          } else {
            alert('Please Speak again');
          }
        }
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
      if (!this.props.isAudioPreprocessing) {
        this.props.saveIndb(base64Data);
      } else {
        if (this.state.soundDetected) {
          this.props.saveIndb(base64Data);
        } else {
          alert('Please Speak again');
        }
      }
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
              <AudioAnalyser {...(lang_code === 'kn' || lang_code ===  'ta' ? audioProps_tamil : audioProps)}></AudioAnalyser>
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
                        onClick={() => {
                          this.handleStop()
                        }}
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
                    onClick={() => {
                      this.handleMic();
                    }}
                  ></img>

                  {/* <h4 className="record_text text-speak m-0">Stop</h4> */}
                  {/* <h4 className="text-speak m-0">Speak</h4> */}
                </>
              );
            }
          })()}
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
        </center>
      </div>
    );
  }
}
