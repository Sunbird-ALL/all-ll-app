import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import mic from "../../assests/Images/mic.png";
import mic_on from "../../assests/Images/mic_on.jpg";

export default class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
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
      audioType: "audio/wav",
    });
  }

  render() {
    const { status, audioSrc, audioType } = this.state;
    const audioProps = {
      audioType,
      // audioOptions: {sampleRate: 30000},
      status,
      audioSrc,
      timeslice: 1000, // timeslice
      startCallback: (e) => {
        this.setState({
          audioSrc: "",
        });
        this.props.setRecordedAudio("");
        console.log("succ start", e);
      },
      pauseCallback: (e) => {
        console.log("succ pause", e);
      },
      stopCallback: (e) => {
        let temp_audioSrc = window.URL.createObjectURL(e);
        this.setState({
          audioSrc: temp_audioSrc,
        });
        this.props.setRecordedAudio(temp_audioSrc);
        console.log("succ stop", e);
      },
      onRecordCallback: (e) => {
        console.log("recording", e);
      },
      errorCallback: (err) => {
        console.log("error", err);
      },
    };
    return (
      <div>
        <center>
          {(() => {
            if (status == "recording") {
              return (
                <>
                  <p>Listening... Click to stop and save audio</p>
                  <img
                    src={mic_on}
                    className="micimg mic_stop_record"
                    onClick={() => document.getElementById("stopaudio").click()}
                  ></img>
                </>
              );
            } else {
              return (
                <>
                  <p>Click to record voice</p>
                  <img
                    src={mic}
                    className="micimg mic_record"
                    onClick={() =>
                      document.getElementById("startaudio").click()
                    }
                  ></img>
                </>
              );
            }
          })()}
          <AudioAnalyser {...audioProps}>
            <div className="btn-box hide">
              <br />
              <button
                className="btn"
                id="startaudio"
                onClick={() => this.controlAudio("recording")}
              >
                Start
              </button>
              <button
                className="btn"
                id="stopaudio"
                onClick={() => this.controlAudio("inactive")}
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
