import React from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './Nav';
import Entry from './Entry';
import Home from './Home';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
      <Router>
        <div className="App">
            <Switch>
                <Route path="/" exact component={Entry} />
                <Route path="/entry" component={Entry} />
                <Route path="/home" component={Home} />
            </Switch>
        </div>
      </Router>
  );
}

export default App;
