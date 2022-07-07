import React, {useState} from 'react';

const Recorder = () => {
  const [button, setButton] = useState('pick');

  const onRecordClick = () => {
    chrome.runtime.sendMessage({ type: 'begin-recording' });
  };

  const onPickElClick = () => {
    setButton('record');
    chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
    
  };

  const curButton = button === 'pick' ? <button onClick={onPickElClick}>Pick Elements</button> : <button onClick={onRecordClick}>Record</button>;
  
  return (
    <section id="recorderView">
      {/* <button onClick={onPickElClick}>Pick Elements</button>
      {/* <img src="./icons/record-button" alt="record button" /> */}
      {/* <button onClick={onRecordClick}>Record</button>} */}
      {curButton}
    </section>);
};

export default Recorder;