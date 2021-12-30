import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {SocketContextProvider} from './SocketContext';

ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

