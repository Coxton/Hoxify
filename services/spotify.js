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
  
  module.exports = {
    storeCredentials,
    getAuthorizationUrl,
  };

