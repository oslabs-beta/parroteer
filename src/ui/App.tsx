import * as React from 'react';
import '../styles/popup.css';

export default function App() {
  const onRecordClick = () => {
    chrome.runtime.sendMessage({ type: 'begin-recording' });
  };

  return (
    <div className="popup-padded">
      <h1>Parroteer</h1>
      <button onClick={onRecordClick}>Record</button>
    </div>
  );
}