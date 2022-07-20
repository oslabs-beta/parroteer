
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { RecordingState, EventLog } from '../../types/Events';

interface NavButtonsProps {
  recordingState: RecordingState
  restartSwitch: boolean
  setRestartSwitch: (bool: boolean) => void
  handleRestart: () => void
}

type NavChoice = 'PICK' | 'RECORD' | 'TESTS';
type NavRoute = [path: string, text: string];

const Nav: Record<NavChoice, NavRoute> = {
  PICK: ['/pickerView', 'Pick\nElements'],
  RECORD: ['/recorderView', 'Record'],
  TESTS: ['/testsView', 'View Tests']
};

const NavButtons = ({ recordingState, restartSwitch, setRestartSwitch, handleRestart }: NavButtonsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  let backPath = '', backText = 'Back';
  let nextPath = '', nextText = 'Next';

  // Set next/back buttons and paths depending on current location
  switch (location.pathname) {
    case '/pickerView':
      [nextPath, nextText] = Nav.RECORD;
      break;
    case '/recorderView':
      [backPath, backText] = Nav.PICK;
      [nextPath, nextText] = Nav.TESTS;

      // if (recordingState === 'recording') [nextPath, nextText] = Nav.TESTS;
      // TODO: Need a better way to detect if a recording has been started;
      // user should be able to go forward after starting a recording - including if they've now stopped it,
      // but maybe shouldn't if they haven't started one yet in the current session
      break;
    case '/testsView':
      [backPath, backText] = Nav.RECORD;
      [nextPath] = Nav.PICK;
      nextText = 'Restart';
      break;
  }


  return (
    <nav className='nav-buttons'>
      <button className="back" disabled={!backPath} onClick={() => navigate(backPath)}><i className="back-icon material-symbols-outlined ">navigate_before</i>{backText}</button>
      {/* if current buttion is 'restart' then call restart handler  */}
      <button className="next" disabled={!nextPath} onClick={nextText === 'Restart' ? () => handleRestart() : () => navigate(nextPath)}>{nextText} <i className="next-icon material-symbols-outlined ">navigate_next</i></button>
    </nav>
  );
};

export default NavButtons;
