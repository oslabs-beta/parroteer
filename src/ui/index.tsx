import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

console.log('Running popup app');

ReactDOM.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
  document.getElementById('root')
);