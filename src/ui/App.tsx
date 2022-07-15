import React, { useState, useEffect } from "react";
import '../styles/popup.scss';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import { Routes, Route, Navigate } from 'react-router-dom';
import PickerView from './pickerView/PickerView';
import Tracking from './tracking/Tracking';
import UserTests from './userTests/UserTests';


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingState, setRecordingState] = useState('');
  const [onCorrectTab, setOnCorrectTab] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage({type: 'popup-opened'}).then(res => {
      setRecordingState(res.recordingState);
      setIsLoaded(true);
      if (res.recordedTabId && (res.recordedTabId !== res.activeTabId)) setOnCorrectTab(false);
      if (res.recordingState === 'recording') {
        chrome.action.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        chrome.action.setBadgeText({text: ''});
        chrome.runtime.sendMessage({ type: 'begin-pick-elements' });
        setRecordingState('pre-recording');
      }
    });
  }, []);


  const application =
  <>
    <h1>Parroteer</h1>
    <Navbar />
    <Routes>
      <Route path='/pickerView' element={<PickerView
        recordingState={recordingState}
        setRecordingState={setRecordingState}
      
      />}></Route>
      <Route path='/tracking' element={<Tracking />}></Route>
      <Route path='/userTests' element={<UserTests />}></Route>
      <Route path='*' element={<Navigate to='/recorder' />}></Route>
    </Routes>
  </>;

  return (
    isLoaded ? (onCorrectTab ? application : <h1>Wrong Tab</h1>) : <Loading/>
  );
}