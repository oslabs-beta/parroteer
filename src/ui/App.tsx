import React, { useState, useEffect } from 'react';
import '../styles/popup.scss';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import { Routes, Route, Navigate } from 'react-router-dom';
import Recorder from './recorder/Recorder';
import Tracking from './tracking/Tracking';
import UserTests from './userTests/UserTests';
import WrongTab from './components/WrongTab';


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingState, setRecordingState] = useState('');
  const [onCorrectTab, setOnCorrectTab] = useState(true);
  const [recordingTab, setRecordingTab] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage({type: 'popup-opened'}).then(res => {
      setRecordingState(res.recordingState);
      setRecordingTab(res.recordedTabId);
      setIsLoaded(true);
      if (res.recordedTabId && (res.recordedTabId !== res.activeTabId)) setOnCorrectTab(false);
      if (res.recordingState === 'recording') {
        chrome.action.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        chrome.action.setBadgeText({text: ''});
        chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
        setRecordingState('pre-recording');
      }
    });
  }, [onCorrectTab]);


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

  const wrongTab = <WrongTab
    recordingTab={recordingTab}
    setOnCorrectTab={setOnCorrectTab}
  />;

  return (
    isLoaded ? (onCorrectTab ? application : wrongTab) : <Loading/>
  );
}