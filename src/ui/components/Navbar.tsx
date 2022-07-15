import { Link } from 'react-router-dom';

const Navbar = () => {
  return (<nav>
    <Link to='/recorder' id='recorderLink'>Setup</Link>
    <Link to='/tracking' id='trackingLink'>Recording</Link>
    <Link to='/userTests' id='testsLink'>Tests</Link>
  </nav>);
};

export default Navbar;