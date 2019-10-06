import React from 'react';
import './App.css'
import logo from "./logo.svg";

function Nav() {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a href="http://localhost:8888" className="btn btn-primary" role="button">Login with Spotify!</a>
        </header>
    )
}

export default Nav;