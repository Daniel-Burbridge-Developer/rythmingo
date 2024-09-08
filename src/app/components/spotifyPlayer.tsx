'use client';
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Spotify: any;
  }
}

const SpotifyPlayer: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;

    // Initialize Spotify player
    const initializePlayer = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('initialization_error', ({ message }: any) => {
        console.error('Initialization Error:', message);
      });
      spotifyPlayer.addListener('authentication_error', ({ message }: any) => {
        console.error('Authentication Error:', message);
      });
      spotifyPlayer.addListener('account_error', ({ message }: any) => {
        console.error('Account Error:', message);
      });
      spotifyPlayer.addListener('playback_error', ({ message }: any) => {
        console.error('Playback Error:', message);
      });

      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        console.log('Player State Changed:', state);
      });
      spotifyPlayer.addListener('ready', ({ device_id }: any) => {
        console.log('Player is ready:', device_id);
        setPlayer(spotifyPlayer);
      });

      spotifyPlayer.connect();
    };

    initializePlayer();

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

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
