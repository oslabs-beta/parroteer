import React, { useState, useEffect } from "react";
import '../styles/popup.css';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Recorder from './recorder/Recorder';
import Tracking from './tracking/Tracking';
import UserTests from './userTests/UserTests';


export default function App() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingState, setRecordingState] = useState('');

  useEffect(() => {
    chrome.runtime.sendMessage({type: 'popup-opened'}).then(res => {
      console.log('RESPONSE RECORDING STATE', res.recordingState);
      setRecordingState(res.recordingState);
      setIsLoaded(true);
      console.log('THIS IS THE RECORDING STATE', recordingState);
      if (res.recordingState === 'recording') {
        chrome.action.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        chrome.action.setBadgeText({text: ''});
        chrome.runtime.sendMessage({ type: 'pause-recording' });
        setRecordingState('pre-recording');
      }// else if (res.recordingState === '')
    });
  }, []);



  const application =
  <>
    <h1>Parroteer</h1>
    <Navbar />
    <Routes>
      <Route path='/recorder' element={<Recorder
        recordingState={recordingState}
        setRecordingState={setRecordingState}
      
      />}></Route>
      <Route path='/tracking' element={<Tracking />}></Route>
      <Route path='/userTests' element={<UserTests />}></Route>
      <Route path='*' element={<Navigate to='/recorder' />}></Route>
    </Routes>
  </>;

  return (
    isLoaded ? application : <h1>Hello there</h1>
  );
}