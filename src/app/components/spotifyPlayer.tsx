'use client';
import React, { useEffect, useState } from 'react';

// Define more specific types for the Spotify Web Playback SDK
interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}

interface SpotifyPlayer {
  addListener: <T>(event: string, callback: (data: T) => void) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  togglePlay: () => Promise<void>;
  play: (options: { uris: string[] }) => Promise<void>;
}

interface PlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      uri: string;
      name: string;
      artist: string;
      album: string;
      album_type: string;
    };
  };
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

      spotifyPlayer.addListener(
        'initialization_error',
        ({ message }: { message: string }) => {
          console.error('Initialization Error:', message);
        }
      );
      spotifyPlayer.addListener(
        'authentication_error',
        ({ message }: { message: string }) => {
          console.error('Authentication Error:', message);
        }
      );
      spotifyPlayer.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          console.error('Account Error:', message);
        }
      );
      spotifyPlayer.addListener(
        'playback_error',
        ({ message }: { message: string }) => {
          console.error('Playback Error:', message);
        }
      );

      spotifyPlayer.addListener(
        'player_state_changed',
        (state: PlayerState) => {
          console.log('Player State Changed:', state);
        }
      );
      spotifyPlayer.addListener(
        'ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Player is ready:', device_id);
          setPlayer(spotifyPlayer);
        }
      );

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
      <button onClick={() => playTrack('spotify:track:405a3a03fa9a44ed')}>
        Play Track
      </button>
    </div>
  );
};

export default SpotifyPlayer;
