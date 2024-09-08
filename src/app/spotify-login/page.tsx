'use client';
import React, { useEffect, useState } from 'react';
import SpotifyPlayer from '../components/spotifyPlayer';

export default function LoginPage() {
  const [accessToken, setAccessToken] = useState('');
  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI || '')}&scope=user-read-private user-read-email streaming app-remote-control user-modify-playback-state user-read-playback-state`;

  useEffect(() => {
    console.log('Use Effect Triggered');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Fetch access token from the backend
      console.log('Fetching from the backend');
      fetch(`/api/spotify/callback?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            setAccessToken(data.accessToken);
          } else {
            console.error('Failed to fetch access token:', data.error);
          }
        });
      console.log('Fetched the data');
    }
  }, []);
  return (
    <div>
      {!accessToken ? (
        <a href={SPOTIFY_AUTH_URL}>
          <button>Login with Spotify</button>
        </a>
      ) : (
        <SpotifyPlayer accessToken={accessToken} />
      )}
    </div>
  );
}
