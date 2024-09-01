'use client';

import React from 'react';

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI!)}&scope=user-read-private user-read-email`;

export default function LoginButton() {
  return (
    <a href={SPOTIFY_AUTH_URL}>
      <button>Login with Spotify</button>
    </a>
  );
}
