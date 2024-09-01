import React from 'react';

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=user-read-private`;

const LoginPage = () => {
  return (
    <div>
      <a href={SPOTIFY_AUTH_URL}>
        <button>Login to Spotify</button>
      </a>
    </div>
  );
};

export default LoginPage;
