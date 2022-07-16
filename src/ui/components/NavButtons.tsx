
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

interface StateProps {
  recordingState: string,
  setRecordingState: (str: string) => void
}

const NavButtons = (props: StateProps) => {
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