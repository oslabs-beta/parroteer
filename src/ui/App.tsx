import * as React from 'react';
import '../styles/popup.css';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Recorder from './recorder/Recorder';
import Tracking from './tracking/Tracking';
import UserTests from './userTests/UserTests';

export default function App() {
  return (<>
    <h1>Parroteer</h1>
    <Navbar />
    <Routes>
      <Route path='/recorder' element={<Recorder />}></Route>
      <Route path='/tracking' element={<Tracking />}></Route>
      <Route path='/userTests' element={<UserTests />}></Route>
      <Route path='*' element={<Navigate to='/recorder' />}></Route>
    </Routes>
  </>);
}