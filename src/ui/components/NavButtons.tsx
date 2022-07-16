
import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';

const NavButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav>
      <p>Pathname: {location.pathname}</p>
      <Link to='/pickerView' id='pickerLink'>Element Picker</Link>
      <Link to='/recorderView' id='recorderLink'>Recording</Link>
      <Link to='/testsView' id='testsLink'>Tests</Link>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate(1)}>Next</button>
    </nav>
  );
};

export default NavButtons;

// Requirements:

// If current view is picker & elements have NOT been selected:
//   Back button is disabled
//   Next button is disabled
// Else if current view is picker & elements have been selected:
//   Back button is disabled
//   Next button is enabled and links to recorder view

// If current view is recorder & a recording has NOT been started:
//   Back button is enabled and links to picker view
//   Next button is disabled
// Else if current view is picker & a recording has been started:
//   Back button is enabled and links to picker view
//   Next button is enabled and links to test view

// If current view is test
//   Back button is enabled and links to recorder view
//   Next button becomes start over button