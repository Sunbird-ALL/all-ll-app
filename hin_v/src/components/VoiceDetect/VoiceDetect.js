import React, { useState, useEffect } from "react";
import AudioRecorder from "../AudioRecorder/AudioRecorder";

import { showLoading, stopLoading } from "../../utils/Helper/SpinnerHandle";

const VoiceDetect = (props) => {
  const [recordedAudio, setRecordedAudio] = useState("");
  const [recordedAudioBase64, setRecordedAudioBase64] = useState("");
  useEffect(() => {
    if (recordedAudio !== "") {
      showLoading();
      let uri = recordedAudio;
      var request = new XMLHttpRequest();
      request.open("GET", uri, true);
      request.responseType = "blob";
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          console.log("DataURL:", e.target.result);
          var base64Data = e.target.result.split(",")[1];
          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
      stopLoading();
    } else {
      stopLoading();
      setRecordedAudioBase64("");
    }
  }, [recordedAudio]);

  //get permission
  //temp variable
  const [loadCnt, setLoadCnt] = useState(0);
  const [audioPermission, setAudioPermission] = useState(null);
  //onmount
  useEffect(() => {
    if (loadCnt == 0) {
      getpermision();
      setLoadCnt((loadCnt) => Number(loadCnt + 1));
    }
  }, [loadCnt]);
  const getpermision = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setAudioPermission(true);
      },
      () => {
        console.log("Permission Denied");
        setAudioPermission(false);
        //alert("Microphone Permission Denied");
      }
    );
  };
  return (
    <>
      <center>
        {(() => {
          if (audioPermission != null) {
            if (audioPermission) {
              return (
                <>
                  <AudioRecorder setRecordedAudio={setRecordedAudio} />
                  {recordedAudio !== "" ? (
                    <>
                      <br />
                      <b>Wav File Store on URL :</b>
                      <br />
                      {recordedAudio}
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            } else {
              return (
                <h5 className="deniedtext">Microphone Permission Denied</h5>
              );
            }
          }
        })()}
      </center>
    </>
  );
};

export default VoiceDetect;
