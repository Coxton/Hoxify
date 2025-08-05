
//Initialize Spotify OAuth Flow: Fetching ClientId and ClientSecret

const fs = require('fs');
const path = require('path');
const axios = require('axios');

let clientId        = "";
let clientSecret    = "";


function storeCredentials(id, secret){
    clientId        = id;
    clientSecret    = secret;

    //console.log("ID:" +  clientId + "Secret:" + clientSecret);

}

function getAuthorizationUrl() {
    const redirectUri = 'http://localhost:8888/callback';
    const scopes = 

    ['user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-private',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',].join(' ');

    return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  }


  //fetch current Song
  //TODO: UPDATE GUI AND CALL IT IN INTERVALLS

  async function getCurrentPlayback() {
  try {
    const tokenPath = path.join(__dirname, '../config/spotify_tokens.json');
    const file = fs.readFileSync(tokenPath, 'utf-8');
    const { access_token } = JSON.parse(file);

    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (res.status === 204 || !res.data?.item) return null;

    const data = res.data;
    const track = data.item;

    return {
      name: track.name,
      artists: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      thumbnail: track.album.images[0]?.url || null,
      progress_ms: data.progress_ms,
      duration_ms: track.duration_ms,
      is_playing: data.is_playing,
    };

  } catch (err) {
    console.error('[Spotify] ❌ getCurrentPlayback error:', err.response?.data || err.message);
    return null;
  }
}


  
  module.exports = {
    storeCredentials,
    getAuthorizationUrl,
    getCurrentPlayback,
  };

