import React from 'react';
import { RecordingState } from '../../types/Events';

interface PickerProps {
  setRecordingState: (str: RecordingState) => void
}

const PickerView = (props: PickerProps) => {
  const {setRecordingState} = props;

  const onPickElClick = () => {
    setRecordingState('pre-recording');
    chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
    chrome.action.setBadgeText({text: 'PICK'});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  };
  
  return (
    <section id="pickerView">
      <p>Picker View</p>
      <button onClick={onPickElClick}>Pick Elements</button>
    </section>
  );
};

export default PickerView;

// TODO: Disable back button and only enable next button if elements have been selected