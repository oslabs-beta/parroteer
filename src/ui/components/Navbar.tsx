
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (<nav>
    <Link to='/pickerView' id='pickerLink'>Element Picker</Link>
    <Link to='/recorderView' id='recorderLink'>Recording</Link>
    <Link to='/testsView' id='testsLink'>Tests</Link>
  </nav>);
};

export default Navbar;