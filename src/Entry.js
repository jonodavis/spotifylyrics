import React, { Component } from "react";
import './App.css'
import "./App.css";
import secrets from "./secrets"
import querystring from "querystring"
import hash from "./hash"
import Home from "./Home";

// function Nav() {
//     return (
//         <header className="App-header">
//             <a href="http://localhost:8888" className="btn btn-primary" role="button">Login with Spotify!</a>
//         </header>
//     )
// }

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = secrets.client_id;
const redirectUri = "http://localhost:3000";
const scope = "user-read-private user-read-email user-read-playback-state";

let r = 'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
  response_type: "token",
  client_id: clientId,
  scope: scope,
  redirect_uri: redirectUri,
  // state: "aaaaaaaaaaaaaaaa"
})


class Entry extends Component {
  constructor() {
    super()
    this.state = {
      token: null,
    }
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    console.log(hash)
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
    console.log(this.state.token)
  }

render() {
  return (
    <div className="Entry">
      {!this.state.token && (
        <a
          className="btn btn--loginApp-link"
          href={ r }
        >
          Login with Spotify
        </a>
      )}
      {this.state.token && (
            <Home />
          )}
    </div>
  );
  }
}
export default Entry;