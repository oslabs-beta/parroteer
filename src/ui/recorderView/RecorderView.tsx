import React from 'react';
import TextList from '../components/TextList';
import { EventLog, RecordingState, MutationEvent } from '../../types/Events';


interface RecProps {
  recordingState: string,
  setRecordingState: (str: RecordingState) => void
  setTests: (str: string) => void
  events: EventLog
  onEndClick: () => void
}


const RecorderView = (props: RecProps) => {
  const {recordingState, setRecordingState, events, setTests, onEndClick} = props;
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


  const buttons = {
    record: <button onClick={onRecordClick}><i className="record-icon material-symbols-outlined ">radio_button_checked</i></button>,
    pause: <button onClick={onPauseClick}><i className="pause-icon material-symbols-outlined ">pause_circle</i></button>,
    Resume: <button onClick={onResumeClick}><i className="play-icon material-symbols-outlined ">play_circle</i></button>,
    end: <button onClick={onEndClick}><i className="stop-icon material-symbols-outlined ">stop_circle</i></button>
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
      <div className="actionBtns">
        {curButtons}
        {recordingState === 'off' ? null : buttons.end}
        <p>Start/stop recording</p>
      </div>
      <TextList>
        { textItems }
      </TextList>
    </section>
  );
};

export default RecorderView;










