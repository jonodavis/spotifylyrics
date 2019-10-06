import React, { Component } from 'react';
import './App.css'
import secrets from './secrets'

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Home extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '', lyrics: '' }
        }
    }

    getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }
    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            })
        this.getLyrics()
    }

    getLyrics() {
        console.log(secrets.genius_token)
        fetch(`https://api.genius.com/search?q=${this.state.nowPlaying.name}`, {mode: 'cors', headers: {"Authorization": `Bearer ${secrets.genius_token}`}})
            .then(
                (json) => {
                    return json.json()
            }).then(
                (response) => {
                    console.log(response)
                }
            )
    }

    render() {
        return (
            <div className="App">
                <div>
                    Now Playing: { this.state.nowPlaying.name }
                </div>
                <div>
                    <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
                </div>
                { this.state.loggedIn &&
                <button className="btn btn-info"  onClick={() => this.getNowPlaying()}>
                    Fetch Now Playing
                </button>
                }
            </div>
        );
    }
}
export default Home;