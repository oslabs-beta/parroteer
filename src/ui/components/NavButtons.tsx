
import React from 'react';
import {Link, Routes, Route, useNavigate} from 'react-router-dom';


const NavButtons = () => {
  const navigate = useNavigate();

  return (
    <nav>
      <Link to='/pickerView' id='pickerLink'>Element Picker</Link>
      <Link to='/recorderView' id='recorderLink'>Recording</Link>
      <Link to='/testsView' id='testsLink'>Tests</Link>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate(1)}>Next</button>
    </nav>
  );
};

export default NavButtons;