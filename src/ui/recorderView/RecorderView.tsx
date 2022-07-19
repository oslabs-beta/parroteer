import React from 'react';
import TextList from '../components/TextList';
import { EventLog, RecordingState, MutationEvent } from '../../types/Events';


interface RecProps {
  recordingState: string,
  setRecordingState: (str: RecordingState) => void
  setTests: (str: string) => void
  events: EventLog
}


const RecorderView = (props: RecProps) => {
  const {recordingState, setRecordingState, events, setTests} = props;
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
    chrome.runtime.sendMessage({ type: 'stop-recording' }).then((res) => {
      setTests(res);
    });
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

  const textItems = events.map((event, i) => {
    const {type, selector } = event;

    if (type === 'input') {
      // ex: Pressed A key on div#id.class
      const {eventType, key} = event;
      const action = (
        eventType === 'click' ? 'Clicked '
        : eventType === 'keydown' ? `Pressed ${key} key on `
        : 'Unknown Event on '
      );
      const displayText = action + selector;
      return <li key={i}>{displayText}</li>;
    } else if (type === 'mutation') {
      // { pID: '34tgds', textContent: 'hello', class: 'newclass' }
      // ex: Property on element changed to
      const listItems = [];
      for (const _key in event) {
        let mutationCount = 0;
        const key = _key as keyof MutationEvent;
        if (['textContent', 'value', 'class'].includes(key)) {
          mutationCount++;
          listItems.push(<li key={i + '.' + mutationCount}>&quot;{key}&quot; on {selector} changed to {event[key]}</li>);
        }
      }
      return (<>{listItems}</>);
    } else {
      return null;
    }
  });

  return (
    <section id="recorderView">
      <p>Recorder View</p>
      {curButtons}
      {recordingState === 'off' ? null : buttons.end}
      <TextList>
        { textItems }
      </TextList>
    </section>
  );
};

export default RecorderView;










