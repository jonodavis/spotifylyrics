import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a href="http://localhost:8888" className="btn btn-primary" role="button">Login with Spotify!</a>
      </header>
    </div>
  );
}

export default App;
