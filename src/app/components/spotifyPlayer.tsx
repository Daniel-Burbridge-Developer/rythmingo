'use client';
import React, { useEffect, useState } from 'react';

// Define more specific types for the Spotify Web Playback SDK
interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}

interface SpotifyPlayer {
  addListener: (event: string, callback: (data: any) => void) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  togglePlay: () => Promise<void>;
  play: (options: { uris: string[] }) => Promise<void>;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
  }
}

const SpotifyPlayer: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    // Initialize Spotify player
    const initializePlayer = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });
      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error:', message);
      });
      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        console.log('Player State Changed:', state);
      });
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player is ready:', device_id);
        setPlayer(spotifyPlayer);
      });

      spotifyPlayer.connect();
    };

    initializePlayer();

    return () => {
      player?.disconnect();
    };
  }, [accessToken, player]);

  const playTrack = (uri: string) => {
    if (player) {
      player.togglePlay().then(() => {
        player.play({
          uris: [uri],
        });
      });
    }
  };

  return (
    <div>
      <button onClick={() => playTrack('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp')}>
        Play Track
      </button>
    </div>
  );
};

export default SpotifyPlayer;
