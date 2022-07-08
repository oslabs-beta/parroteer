import React, {useState} from 'react';

const Recorder = () => {
  const [button, setButton] = useState('pick');

  const onRecordClick = () => {
    chrome.runtime.sendMessage({ type: 'begin-recording' });
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: 'red'});
  };

  const onPickElClick = () => {
    setButton('record');
    chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
    chrome.action.setBadgeText({text: 'PICK'});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  };

  const curButton = button === 'pick' ? <button onClick={onPickElClick}>Pick Elements</button> : <button onClick={onRecordClick}>Record</button>;
  
  return (
    <section id="recorderView">
      {/* <button onClick={onPickElClick}>Pick Elements</button>
      {/* <img src="./icons/record-button" alt="record button" /> */}
      {/* <button onClick={onRecordClick}>Record</button>} */}
      {curButton}
    </section>
  );
};

export default Recorder;