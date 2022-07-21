import React, { useState, useEffect } from 'react';
import '../styles/popup.scss';
import NavButtons from './components/NavButtons';
import Loading from './components/Loading';
import {Routes, Route, useNavigate} from 'react-router-dom';
import PickerView from './pickerView/PickerView';
import RecorderView from './recorderView/RecorderView';
import TestsView from './testsView/TestsView';
import WrongTab from './components/WrongTab';
import { RecordingState, EventLog } from '../types/Events';


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('off');
  const [onCorrectTab, setOnCorrectTab] = useState(true);
  const [recordingTab, setRecordingTab] = useState(null);
  // const [tests, setTests] = useState('');
  // const [elementState, setElementState] = useState({});
  const [events, setEvents] = useState<EventLog>([]);
  const [restartSwitch, setRestartSwitch] = useState<boolean>(false);
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
      // setTests(res.tests);
      if (res.recordedTabId && (res.recordedTabId !== res.activeTabId)) setOnCorrectTab(false);
      if (res.recordingState === 'recording') {
        navigate('/recorderView');
      } else if (res.recordingState === 'pre-recording'){
        navigate('/pickerView');
      } else if (res.recordingState === 'off'){
        navigate('/pickerView');
      }
    });
  }, [onCorrectTab, restartSwitch]);

  const handleRestart = () => {
    chrome.runtime.sendMessage({type: 'restart-recording'});
    console.log('onclick handleRestart');
    chrome.action.setBadgeText({text: ''});
    setRestartSwitch(!restartSwitch);
    navigate('/pickerView');
  };

  const onEndClick = () => {
    setRecordingState('off');
    chrome.action.setBadgeText({text: ''});
    chrome.runtime.sendMessage({ type: 'stop-recording' });
  };


// Why element not component?
// Why Routes and not Router?
// No switch?
  const application =
  <>
    <header>

      <img className="logo-icon" src="././icons/parrot_48.png"></img>
      <h1>Parroteer</h1>
      <button onClick={handleRestart}><i className="restart-icon material-symbols-outlined ">restart_alt</i></button>
    </header>
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
          onEndClick={onEndClick}
        />}/>
      <Route path='/testsView' element={
        <TestsView
          // tests={tests}
          // setTests={setTests}
        />}/>

    </Routes>

    <NavButtons
      handleRestart={handleRestart}
      recordingState={recordingState}
      setRestartSwitch={setRestartSwitch}
      restartSwitch={restartSwitch}
      onEndClick={onEndClick}
    />
  </>;

  const wrongTab = <WrongTab
    recordingTab={recordingTab}
    setOnCorrectTab={setOnCorrectTab}
  />;

  return (
    isLoaded ? (onCorrectTab ? application : wrongTab) : <Loading/>
  );
}