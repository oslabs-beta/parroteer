import React, { useState, useEffect } from 'react';
import '../styles/popup.scss';
import NavButtons from './components/NavButtons';
import Loading from './components/Loading';
import {Routes, Route, useNavigate} from 'react-router-dom';
import PickerView from './pickerView/PickerView';
import RecorderView from './recorderView/RecorderView';
import TestsView from './testsView/TestsView';
import WrongTab from './components/WrongTab';
import { RecordingState } from '../types/Events';


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('off');
  const [onCorrectTab, setOnCorrectTab] = useState(true);
  const [recordingTab, setRecordingTab] = useState(null);
  const [tests, setTests] = useState('');
  // const [elementState, setElementState] = useState({});
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.runtime.sendMessage({type: 'popup-opened'}).then(res => {
      console.log(res.recordingState);
      console.log('Popup elementStates', res.elementStates);
      console.log('Popup events', res.events);

      setRecordingState(res.recordingState);
      setRecordingTab(res.recordedTabId);
      // setElementState(res.elementStates);
      setEvents(res.events);
      setIsLoaded(true);

      if (res.recordedTabId && (res.recordedTabId !== res.activeTabId)) setOnCorrectTab(false);
      if (res.recordingState === 'recording') {
        navigate('/recorderView');
      } else if (res.recordingState === 'pre-recording'){
        navigate('/pickerView');
      } else if (res.recordingState === 'off'){
        navigate('/pickerView');
      }
    });


  }, [onCorrectTab]);


// Why element not component?
// Why Routes and not Router?
// No switch?
  const application =
  <>
    <h1>Parroteer</h1>

    <Routes>

      <Route path='/pickerView' element={
        <PickerView
          setRecordingState={setRecordingState}
          events={events}
        />}/>
      <Route path='/recorderView' element={
        <RecorderView
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          events={events}
        />}/>
      <Route path='/testsView' element={
        <TestsView />}/>

    </Routes>

    <NavButtons recordingState={recordingState} />
  </>;

  const wrongTab = <WrongTab
    recordingTab={recordingTab}
    setOnCorrectTab={setOnCorrectTab}
  />;

  return (
    isLoaded ? (onCorrectTab ? application : wrongTab) : <Loading/>
  );
}