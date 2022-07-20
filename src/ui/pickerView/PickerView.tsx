import React from 'react';
import TextList from '../components/TextList';
import { RecordingState, EventLog } from '../../types/Events';

interface PickerProps {
  setRecordingState: (str: RecordingState) => void
  events: EventLog;
}

const PickerView = (props: PickerProps) => {
  const {setRecordingState, events} = props;

  const onPickElClick = () => {
    setRecordingState('pre-recording');
    chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
    chrome.action.setBadgeText({text: 'PICK'});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  };

  const textItems = events.map((event, i) => {
    const {type, selector } = event;

    if (type === 'picked-element') {
      // ex: Element picked selector
      const displayText = `Element picked ${selector}`;
      return <li key={i}>{displayText}</li>;
    }
  });

  return (
    <section id="pickerView">
      <div className="actionBtns">
        <button className="add-btn" onClick={onPickElClick}><i className="add-icon material-symbols-outlined ">add</i></button>
        <p>Pick elements</p>
      </div>
      <TextList>
        { textItems }
      </TextList>
    </section>
  );
};

export default PickerView;

// TODO: Disable back button and only enable next button if elements have been selected