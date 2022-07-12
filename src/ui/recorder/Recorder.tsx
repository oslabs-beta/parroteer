import React, {FunctionComponent, ReactNode, useState} from 'react';

interface RecProps {
  recordingState: string,
  setRecordingState: (str: string) => void
}

// recording state is 'pre-recording' | 'recording' | 'off'

const Recorder = (props: RecProps) => {
  // const [recordingState, setRecordingState] = useState(props.recordingState);
  // const [button, setButton] = useState('pick');
  const {recordingState, setRecordingState} = props;
  let curButtons;

  const onRecordClick = () => {
    setRecordingState('recording');
    chrome.runtime.sendMessage({ type: 'begin-recording' });
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: 'red'});
  };

  const onPickElClick = () => {
    setRecordingState('pre-recording');
    chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
    chrome.action.setBadgeText({text: 'PICK'});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  };

  const onPauseClick = () => {
    setRecordingState('pre-recording');
    chrome.runtime.sendMessage({ type: 'pause-recording' });
    chrome.action.setBadgeText({text: 'PICK'});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  };

  const onResumeClick = () => {
    setRecordingState('recording');
    chrome.runtime.sendMessage({ type: 'begin-recording' });
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: 'red'});
  };

  const onEndClick = () => {
    setRecordingState('off');
    chrome.runtime.sendMessage({ type: 'stop-recording' });
    chrome.action.setBadgeText({text: ''});
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
  };


  const buttons = {
    pick: <button onClick={onPickElClick}>Pick Elements</button>,
    record: <button style={buttonStyle} onClick={onRecordClick}><img src='./icons/record-button.png' /></button>,
    pause: <button style={buttonStyle} onClick={onPauseClick}><img src='./icons/pause-button.png' /></button>,
    Resume: <button style={buttonStyle} onClick={onResumeClick}><img src='./icons/play-button.png' /></button>,
    end: <button style={buttonStyle} onClick={onEndClick}><img src='./icons/stop-button.png' /></button>
  };

  // set the buttons that show up in recorder tab
  if (recordingState === 'recording') {
    curButtons = buttons.pause;
  } else if (recordingState === 'pre-recording') {
    curButtons = buttons.record;
  } else {
    curButtons = buttons.pick;
  }
  
  
  return (
    <section id="recorderView">
      {curButtons}
      {recordingState === 'off' ? null : buttons.end}
    </section>
  );
};

export default Recorder;