
//Start Express Server and fetch Spotify Answer

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

let storedClientId = '';
let storedClientSecret = '';

const tokenPath = path.join(__dirname, '../config/spotify_tokens.json');

//Called from main process to set credentials
function setSpotifyCredentials(clientId, clientSecret) {
  storedClientId = clientId;
  storedClientSecret = clientSecret;
}

//Launch the local callback server
function startServer() {
  const port = 8888;

  app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!storedClientId || !storedClientSecret) {
      return res.status(500).send('Missing Spotify credentials.');
    }

    try {
      //Exchange code for tokens
      const tokenRes = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:8888/callback',
          client_id: storedClientId,
          client_secret: storedClientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token, expires_in } = tokenRes.data;


      //Fetch Spotify profile
      const userRes = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const user = userRes.data;

      //Save tokens + user data to file
      const saveData = {
        access_token,
        refresh_token,
        client_id: storedClientId,
        client_secret: storedClientSecret,
        expires_in,
        timestamp: Date.now(),
        user,

      };

      fs.writeFileSync(tokenPath, JSON.stringify(saveData, null, 2), 'utf-8');
      console.log('[Spotify] 💾 Saved to spotify_tokens.json');

      res.send('<h2>✅ Spotify Authentication Successful!</h2><p>You may now close this window.</p>');

    } catch (err) {
      console.error('[Spotify] ❌ Error:', err.response?.data || err.message);
      res.status(500).send('<h2>❌ Spotify Auth Failed</h2><p>Check the console for details.</p>');
    }
  });

  app.listen(port, () => {
    //console.log(`[Spotify] 🚪 Listening on http://localhost:${port}/callback`);
  });
}

async function validateAccessToken() {
  try {
    const tokenFile = fs.readFileSync(tokenPath, 'utf-8');
    const data = JSON.parse(tokenFile);

    const res = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });

    console.log('[Spotify] ✅ Access token is still valid.');
    return true;

  } catch (err) {
    if (err.response?.status === 401) {
      console.warn('[Spotify] ⚠️ Access token expired, attempting refresh...');
      const refreshed = await refreshAccessToken();
      return !!refreshed;
    }

    console.error('[Spotify] ❌ Token validation error:', err.response?.data || err.message);
    return false;
  }
}


//Refresh access token using refresh_token
async function refreshAccessToken() {
  try {
    const file = fs.readFileSync(tokenPath, 'utf-8');
    const data = JSON.parse(file);

    const { refresh_token } = data;

    if (!refresh_token || !storedClientId || !storedClientSecret) {
      throw new Error('Missing refresh token or credentials');
    }

    const res = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token,
        client_id: storedClientId,
        client_secret: storedClientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = res.data;

    //Update and save new access token
    data.access_token = access_token;
    data.expires_in = expires_in;
    data.timestamp = Date.now();

    fs.writeFileSync(tokenPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[Spotify] 🔁 Access token refreshed successfully.');

    return access_token;

  } catch (err) {
    console.error('[Spotify] ❌ Failed to refresh token:', err.response?.data || err.message);
    return null;
  }
}

module.exports = {
  setSpotifyCredentials,
  startServer,
  refreshAccessToken,
  validateAccessToken
};
