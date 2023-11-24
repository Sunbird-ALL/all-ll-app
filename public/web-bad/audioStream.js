/**
 * audioDetectionConfig.js
 *
 * configuration parameters
 */

/*
 
SAMPLE_POLLING_MSECS

polling time clock in milliseconds. Is the sampling rate to run speech detection calculations.

          █                   
      █   █   █               
      █   █   █   █         
      █   █   █   █   █        
  █   █   █   █   █   █   █    
  █   █   █   █   █   █   █   █    
  █   █   █   █   █   █   █   █   █    
  █   █   █   █   █   █   █   █   █   █   █ 
  █   █   █   █   █   █   █   █   █   █   █   █
  <--><--><--><--><--><--><--><--><--><--><--><-->                   
  ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^   ^
  |   |   |   |   |   |   |   |   |   |   |   |

*/
const SAMPLE_POLLING_MSECS = 50
audioContext = null;
/*
 
MAX_INTERSPEECH_SILENCE_MSECS

elapsed time in milliseconds of silence (pause) between continuous blocks of signal.
This is to decide when to stop recording of a speech made by multiple audio chunks separated by pauses.

That elapsed is used also to decide if a full speech is concluded, generating event 'stoprecording'.

      █  chunk 1                    █
    █ █ █       █             █     █ █ chunk 2      █
    █ █ █ █ █   █   █         █   █ █ █              █ chunk 3
    █ █ █ █ █ █ █ █ █       █ █   █ █ █              █ █   █
  █ █ █ █ █ █ █ █ █ █ █     █ █   █ █ █              █ █ █ █
  █ █ █ █ █ █ █ █ █ █ █     █ █ █ █ █ █ █            █ █ █ █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █ █
                         <->               <-------->               <-------->
  ^                                         silence                   silence ^
  |                                            ^                         ^    |
  speechstart                                  |                         |    speechstop 
                                               |                         |
                                 MAX_INTERSPEECH_SILENCE_MSECS    POST_SPEECH_MSECS
*/                                                      
const MAX_INTERSPEECH_SILENCE_MSECS = 600
const POST_SPEECH_MSECS = MAX_INTERSPEECH_SILENCE_MSECS


/*
 
PRERECORDSTART_MSECS

elapsed time in milliseconds before the speechstart event.


              █   chunk 1                     █
            █ █ █       █             █     █ █              █
            █ █ █ █ █   █   █         █   █ █ █ chunk 2      █
            █ █ █ █ █ █ █ █ █       █ █   █ █ █              █ █   █ chunk 3
          █ █ █ █ █ █ █ █ █ █ █     █ █   █ █ █              █ █ █ █
          █ █ █ █ █ █ █ █ █ █ █     █ █ █ █ █ █ █            █ █ █ █ █ █
          █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █
          █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █ █
          █ █ █ █ █ █ █ █ █ █ █ █   █ █ █ █ █ █ █ █          █ █ █ █ █ █ █ █
<-------->                       <->               <-------->               <--------> 
^ silence ^                                                                           ^
|    ^    |                                                                           |
|    |    speechstart                                                        speechstop  
|    |
| PRERECORDSTART_MSECS             
|              
prerecordstart

*/                                                      
const PRERECORDSTART_MSECS = 600

/*
 
MIN_SIGNAL_DURATION 

minimum elapsed time in millisecond for an audio signal block.
In terms of speech, it corresponds to a letter spelling ('b'), 
a number splelling ('two'), a 'yes'/'no' speech.

It could be usefule to purge out background clicks/noises.
If a signal block chain sample length is less than that value, 
the event 'abortrecording' is generated.

      █                                
    █ █ █       █ chunk 1     █      
    █ █ █ █ █   █   █         █ chunk 2     █
    █ █ █ █ █ █ █ █ █       █ █           █ █
  █ █ █ █ █ █ █ █ █ █ █     █ █           █ █ chunk 3
  █ █ █ █ █ █ █ █ █ █ █     █ █ █       █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █       █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █       █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █   █ █ █       █ █ █
                            <--->       <--->   
                              ^
                              |
                       MIN_SIGNAL_DURATION  
*/
const MIN_SIGNAL_DURATION = 400


/*
 
VOLUME_MUTE
VOLUME_SILENCE
VOLUME_SIGNAL

Volume Thresholds levels, for 

signal (speech)
silence (background noise)
mute (microphone off)

*/
const VOLUME_SIGNAL = 0.02
const VOLUME_SILENCE = 0.001
const VOLUME_MUTE = 0.0001

/*
 
MIN_AVERAGE_SIGNAL_VOLUME
Minimum volume vale (in average) of a signal block chain.
It is to calculate if a signal block contains speech or just noise.

If a signal block chain sample doesn't exceed that threshold value, 
the event 'abortrecording' is generated.

*/
const MIN_AVERAGE_SIGNAL_VOLUME = 0.04


const DEFAULT_PARAMETERS_CONFIGURATION = {

  timeoutMsecs: SAMPLE_POLLING_MSECS,
  
  prespeechstartMsecs: PRERECORDSTART_MSECS,
  
  speakingMinVolume: VOLUME_SIGNAL, 
  
  silenceVolume: VOLUME_SILENCE,
  
  muteVolume: VOLUME_MUTE,

  recordingEnabled: true

}




/* eslint-env browser */

/**
 *
 * @see
 * https://stackoverflow.com/questions/9018771/how-to-best-determine-volume-of-a-signal
 * https://dsp.stackexchange.com/questions/46147/how-to-get-the-volume-level-from-pcm-audio-data
 *
 */ 


/**
 * volumeState
 *
 * volume range state of a single sample. Possible values:
 *
 *   'mute'
 *   'silence'
 *   'signal'
 *   'clipping' TODO
 *
 */ 
let volumeState = 'mute'

let speechStarted = false

let silenceItems = 0
let signalItems = 0

let speechstartTime 
let prerecordingItems = 0

let speechVolumesList = [] 

/**
 * functions
 */

/*
 * average
 *
 * calculate the average value of an array of numbers
 *
 */ 
const average = (array) => array.reduce((a, b) => a + b) / array.length

const averageSignal = () => average(speechVolumesList).toFixed(4)

const maxSilenceItems = Math.round(MAX_INTERSPEECH_SILENCE_MSECS / SAMPLE_POLLING_MSECS)

const dispatchEvent = (eventName, eventData) => document.dispatchEvent(new CustomEvent( eventName, eventData ))

/**
 * mute
 *
 * Emits 2 custom events:
 *
 *  AUDIO SAMPLING:
 *    'mute'    -> audio volume is almost zero, the mic is off.
 *
 *  MICROPHONE:
 *    'mutedmic' -> microphone is MUTED (passing from ON to OFF)
 */
function mute(timestamp, duration) {

  const eventData = { 
    detail: { 
      event: 'mute',
      volume: meter.volume, 
      timestamp,
      duration
    } 
  }
  
  dispatchEvent( 'mute', eventData )
  
  // mic is muted (is closed)
  // trigger event on transition
  if (volumeState !== 'mute') {
    dispatchEvent( 'mutedmic', eventData )
    volumeState = 'mute'
  }  

}  


/**
 * signal
 *
 * Emits 3 custom events:
 *
 *  AUDIO SAMPLING:
 *    'signal'  -> audio volume is high, so probably user is speaking.
 *
 *  MICROPHONE:
 *    'unmutedmic'  -> microphone is UNMUTED (passing from OFF to ON)
 *
 *  RECORDING:
 *    'speechstart' -> speech START
 *
 */ 
function signal(timestamp, duration) {

  silenceItems = 0
  
  const eventData = { 
    detail: { 
      event: 'signal',
      volume: meter.volume, 
      timestamp,
      duration,
      items: ++ signalItems
    } 
  }
 
  if (! speechStarted) {

    dispatchEvent( 'speechstart', eventData )

    speechstartTime = timestamp
    speechStarted = true
    speechVolumesList = []
  }  

  speechVolumesList.push(meter.volume)

  dispatchEvent( 'signal', eventData )

  // mic is unmuted (is open)
  // trigger event on transition
  if (volumeState === 'mute') {
    dispatchEvent( 'unmutedmic', eventData )
    volumeState = 'signal'
  }  

}  

/**
 * silence
 *
 * Emits 3 custom events:
 *
 *  AUDIO SAMPLING:
 *    'silence' -> audio volume is pretty low, the mic is on but there is not speech.
 *
 *  MICROPHONE:
 *    'unmutedmic'  -> microphone is UNMUTED (passing from OFF to ON)
 *
 *  RECORDING:
 *    'speechstop'  -> speech recording STOP (success, recording seems a valid speech)
 *    'speechabort' -> speech recording ABORTED (because level is too low or audio duration length too short)
 *
 */ 
function silence(timestamp, duration) {

  signalItems = 0

  const eventData = { 
    detail: { 
      event: 'silence',
      volume: meter.volume, 
      timestamp,
      duration,
      items: ++ silenceItems
    } 
  }
 
  dispatchEvent( 'silence', eventData )

  // mic is unmuted (goes ON)
  // trigger event on transition
  if (volumeState === 'mute') {
    dispatchEvent( 'unmutedmic', eventData )
    volumeState = 'silence'
  }  

  //
  // after a MAX_INTERSPEECH_SILENCE_MSECS 
  // a virdict event is generated:
  //   speechabort if audio chunck is to brief or at too low volume 
  //   speechstop  if audio chunk appears to be a valid speech
  //
  if ( speechStarted && (silenceItems === maxSilenceItems) ) {

    const signalDuration = duration - MAX_INTERSPEECH_SILENCE_MSECS
    const averageSignalValue = averageSignal()

    // speech abort 
    // signal duration too short
    if ( signalDuration < MIN_SIGNAL_DURATION ) {

      eventData.detail.abort = `signal duration (${signalDuration}) < MIN_SIGNAL_DURATION (${MIN_SIGNAL_DURATION})`
      dispatchEvent( 'speechabort', eventData )
    }  

    // speech abort
    // signal level too low
    else if (averageSignalValue < MIN_AVERAGE_SIGNAL_VOLUME) {

      eventData.detail.abort = `signal average volume (${averageSignalValue}) < MIN_AVERAGE_SIGNAL_VOLUME (${MIN_AVERAGE_SIGNAL_VOLUME})`
      dispatchEvent( 'speechabort', eventData )
    }  

    // speech stop
    // audio chunk appears to be a valid speech
    else {

      dispatchEvent( 'speechstop', eventData )
    }  

    speechStarted = false
  }  

}  

/**
 
    volume level
0.0 .---->-.----->--.-------->--.-------->--.------> 1.0
    ^      ^        ^           ^           ^
    |      |        |           |           |
    mute   unmute   silence     speaking    clipping
               
*/ 

function sampleThresholdsDecision(muteVolume, speakingMinVolume) {

  const timestamp = Date.now()
  const duration = timestamp - speechstartTime

  //
  // MUTE
  // mic is OFF/mute (volume is ~0)
  //
  if (meter.volume < muteVolume )

    mute(timestamp, duration) 

  //
  // SIGNAL
  // audio detection, maybe it's SPEECH
  //
  else if (meter.volume > speakingMinVolume )

    signal(timestamp, duration)

  //
  // SILENCE
  // mic is ON. Audio level is low (background noise)
  //
  else //(meter.volume < config.silenceVolume )

    silence(timestamp, duration)

}


/**
 * prerecording
 *
 * Emits the event:
 *
 *  RECORDING:
 *    'prespeechstart' -> speech prerecording START
 *
 * Every prespeechstartMsecs milliseconds, 
 * in SYNC with the main sampling (every timeoutMsecs milliseconds)
 *
 * @param {Number} prespeechstartMsecs
 * @param {Number} timeoutMsecs
 *
 */ 
function prerecording( prespeechstartMsecs, timeoutMsecs ) {
  
  ++ prerecordingItems

  const eventData = { 
    detail: { 
      //event: 'prespeechstart',
      volume: meter.volume, 
      timestamp: Date.now(),
      items: prerecordingItems
    } 
  }

  // emit event 'prespeechstart' every prespeechstartMsecs.
  // considering that prespeechstartMsecs is a multimple of timeoutMsecs   
  if ( (prerecordingItems * timeoutMsecs) >= prespeechstartMsecs) {
    
    // emit the event if speech is not started   
    if ( !speechStarted )
      dispatchEvent( 'prespeechstart', eventData )

    prerecordingItems = 0
  }  

}  


/**
 * audio speech detection
 *
 * emit these DOM custom events: 
 *
 *  AUDIO SAMPLING:
 *    'clipping' -> TODO, audio volume is clipping (~1), 
 *                  probably user is speaking, but volume produces distorsion
 *    'signal'   -> audio volume is high, so probably user is speaking.
 *    'silence'  -> audio volume is pretty low, the mic is on but there is not speech.
 *    'mute'     -> audio volume is almost zero, the mic is off.
 *
 *  MICROPHONE:
 *    'unmutedmic'  -> microphone is UNMUTED (passing from OFF to ON)
 *    'mutedmic'    -> microphone is MUTED (passing from ON to OFF)
 *
 *  RECORDING:
 *    'prespeechstart' -> speech prerecording START
 *    'speechstart'    -> speech START
 *    'speechstop'     -> speech STOP (success, recording seems a valid speech)
 *    'speechabort'    -> speech ABORTED (because level is too low or audio duration length too short)
 *
 *
 * @param {Object} config 
 * @see DEFAULT_PARAMETERS_CONFIGURATION object in audioDetectionConfig.js 
 *
 * @see https://javascript.info/dispatch-events
 *
 */

function audioDetection(config) {

  setTimeout( 
    () => {

      prerecording( config.prespeechstartMsecs, config.timeoutMsecs )

      // to avoid feedback, recording could be suspended 
      // when the system play audio with a loudspeakers
      if (config.recordingEnabled) {

        sampleThresholdsDecision(config.muteVolume, config.speakingMinVolume)
      }  

      // recursively call this function
      audioDetection(config)

    }, 
    config.timeoutMsecs 
  )

}


//export { audioDetection }



var mediaStreamSource = null

var recorder = null
function audioRecorder(stream) {
  recorder = new MediaRecorder(stream)
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
// grab an audio context
audioContext = new AudioContext();


audioContext.resume().then( () => {
  console.log('User interacted with the page. Playback resumed successfully')
})



function audioStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  //drawLoop();

  audioDetection(DEFAULT_PARAMETERS_CONFIGURATION)

  audioRecorder(stream)
}

