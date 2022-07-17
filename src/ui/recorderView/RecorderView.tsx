import React from 'react';
import TextList from '../components/TextList';
import { UserInputEvent, MutationEvent } from '../../types/Events';

interface RecProps {
  recordingState: string,
  setRecordingState: (str: string) => void
  events: (UserInputEvent | MutationEvent)[];
}



const RecorderView = (props: RecProps) => {
  const {recordingState, setRecordingState, events} = props;
  // const [tests, setTests] = useState('');
  let curButtons;


  const onRecordClick = () => {
    setRecordingState('recording');
    chrome.runtime.sendMessage({ type: 'begin-recording' });
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: 'red'});
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
    chrome.action.setBadgeText({text: ''});
    chrome.runtime.sendMessage({ type: 'stop-recording' });
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
  };

  const buttons = {
    record: <button style={buttonStyle} onClick={onRecordClick}><img src='./icons/record-button.png' /></button>,
    pause: <button style={buttonStyle} onClick={onPauseClick}><img src='./icons/pause-button.png' /></button>,
    Resume: <button style={buttonStyle} onClick={onResumeClick}><img src='./icons/play-button.png' /></button>,
    end: <button style={buttonStyle} onClick={onEndClick}><img src='./icons/stop-button.png' /></button>
  };

  // set the buttons that show up in recorder tab
  if (recordingState === 'recording') {
    curButtons = buttons.pause;
  } else {
    curButtons = buttons.record;
  }



  return (
    <section id="recorderView">
      <p>Recorder View</p>
      {curButtons}
      {recordingState === 'off' ? null : buttons.end}

      <TextList events={events}/>
    </section>
  );
};

export default RecorderView;










