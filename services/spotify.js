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

  async function logCurrentPlayback() {
  try {
    const file = fs.readFileSync(path.join(__dirname, '../config/spotify_tokens.json'), 'utf-8');
    const { access_token } = JSON.parse(file);

    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (res.status === 204 || !res.data?.item) {
      console.log('[Spotify] 🔇 Nothing is currently playing.');
      return;
    }

    const track = res.data.item;

    console.log('\n[Spotify] 🎵 Currently Playing:');
    console.log('Track:   ', track.name);
    console.log('Artists: ', track.artists.map(a => a.name).join(', '));
    console.log('Album:   ', track.album.name);
    console.log('Progress:', `${Math.floor(res.data.progress_ms / 1000)}s / ${Math.floor(track.duration_ms / 1000)}s`);
    console.log('Playing: ', res.data.is_playing ? '▶️ Playing' : '⏸️ Paused');
    console.log('Device:  ', res.data.device.name);

  } catch (err) {
    console.error('[Spotify] ❌ Error while fetching current track:', err.response?.data || err.message);
  }
}

logCurrentPlayback();

  
  module.exports = {
    storeCredentials,
    getAuthorizationUrl,
  };

