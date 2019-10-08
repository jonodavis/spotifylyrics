import React, { Component } from 'react';
import './App.css'
import secrets from './secrets'
import SpotifyWebApi from 'spotify-web-api-js';
import cheerio from 'cheerio';
import { Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import request from 'request';


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
            loggedIn: !!token,
            isPlaying : false,
            nowPlaying: { name: '', albumArt: '', artist : ''}
        }
        console.log(token)
        window.location.hash = "";
    }

    getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q);
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }
    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                if (response.is_playing) {
                    this.setState({
                        isPlaying : response.is_playing,
                        nowPlaying: {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url,
                            artist : response.item.artists[0].name
                        }
                    });
                }
                console.log(response)
            })
            .then( () => {
                if (this.state.isPlaying) {
                    this.searchSong();
                }
                
            })
    }

    searchSong() {
        fetch(`https://api.genius.com/search?q=${this.state.nowPlaying.name}&access_token=${secrets.genius_token}`)
            .then(
                (json) => {
                    return json.json()
                }).then(
                    (response) => {
                        this.setState({
                            nowPlaying: {
                                ...this.state.nowPlaying,
                                songId: response.response.hits[0].result.id
                            }
                        });
                        return response.response.hits[0].result.url
                    }).then((url) => {this.scrapSong(url)})
    }

    scrapSong(url) {
        console.log(url);
        console.log(this.state.nowPlaying);
        //fix this hacky fix xd
        request('https://cors-anywhere.herokuapp.com/' + url,function(err,res,body) {
            let html = cheerio.load(body);
            let scrapedLyrics = html('.lyrics').text().split('\n');

            // scrapedLyrics.replace("\n","<br>\n");
            this.setState({
                nowPlaying: {
                    ...this.state.nowPlaying,
                    scrapedLyrics: scrapedLyrics
                }
            });
            console.log(this.state.nowPlaying)
        }.bind(this))
    }
    getSong() {
        console.log(secrets.genius_token);
        fetch(`https://api.genius.com/songs/${this.state.nowPlaying.songId}?access_token=${secrets.genius_token}`)
            .then(
                (response) => {
                    console.log('success');
                    return response.json()
                }).then(response => console.log(response.response))
    }

    generateLyrics = () => {
        let contents = [];
        // Outer loop to create parent
        let lyricsLst = this.state.nowPlaying.scrapedLyrics;
        if (lyricsLst !== undefined) {
            for (let i = 0; i < lyricsLst.length; i++) {
                //Create the parent and add the children
                contents.push(<p key={i}>{lyricsLst[i]}</p>)
            }
            return contents
        }
    };

    render() {
        return (
            <div className="App">
                <div className="container">
                    { this.state.isPlaying &&
                        <div className="row">
                            <div className="col">
                                    <div className="now_playing">

                                        <div className='row justify-content-center'>
                                            <Image src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt='' />
                                        </div>

                                        <div className='row justify-content-center'>
                                            <strong> {this.state.nowPlaying.name} </strong>
                                        </div>

                                        <div className='row justify-content-center'>
                                            {this.state.nowPlaying.artist}
                                        </div>

                                        <div className='row justify-content-center'>
                                            { this.state.loggedIn &&
                                            <button className="btn btn-info"  onClick={() => this.getNowPlaying()}>
                                                Fetch Now Playing
                                            </button>
                                            }
                                        </div>
                                    </div>
                            </div>
                            <div className="col">
                                <div>
                                    {this.generateLyrics()}
                                </div>
                            </div>
                        </div>
                    }
                    {  !this.state.isPlaying &&

                        <div style={{marginTop: "37%"}}>
                            { this.state.loggedIn &&
                            <button className="btn btn-info"  onClick={() => this.getNowPlaying()}>
                                <strong>Fetch Lyrics</strong>
                            </button>
                            }
                        </div>

                    }

                </div>

            </div>
        );
    }
}
export default Home;