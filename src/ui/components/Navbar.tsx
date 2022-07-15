
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (<nav>
    <Link to='/pickerView' id='pickerLink'>Setup</Link>
    {/* <Link to='/tracking' id='trackingLink'>Recording</Link>
    <Link to='/userTests' id='testsLink'>Tests</Link> */}
  </nav>);
};

export default Navbar;