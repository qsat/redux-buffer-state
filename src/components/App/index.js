import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import logo from './logo.svg';
import './App.css';

import Input from '../Input'

export default function App() {
  const { storeState } = useContext(ReactReduxContext);

  const val = storeState.app.sample.value
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Input value={val} />
      </header>
    </div>
  )
}
