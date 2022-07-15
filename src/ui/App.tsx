import React, { useState, useEffect } from "react";
import '../styles/popup.scss';
import NavButtons from './components/NavButtons';
import Loading from './components/Loading';
import {Routes, Route, Navigate} from 'react-router-dom';
import PickerView from './pickerView/PickerView';
import RecorderView from './recorderView/RecorderView';
import TestsView from './testsView/TestsView';


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
 
    <Routes>
      <Route path='/pickerView' element={<PickerView
        recordingState={recordingState}
        setRecordingState={setRecordingState}
      />}></Route>
      <Route path='/recorderView' element={<RecorderView />}></Route>
      <Route path='/testsView' element={<TestsView />}></Route>
      <Route path='*' element={<Navigate to='/pickerView' />}></Route>
    </Routes>

    <NavButtons />
  </>;

  return (
    isLoaded ? (onCorrectTab ? application : <h1>Wrong Tab</h1>) : <Loading/>
  );
}