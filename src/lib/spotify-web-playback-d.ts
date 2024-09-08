declare namespace Spotify {
  interface Player {
    addListener(event: string, callback: (state: any) => void): boolean;
    connect(): Promise<boolean>;
    disconnect(): void;
    getCurrentState(): Promise<any>;
    getVolume(): Promise<number>;
    nextTrack(): Promise<void>;
    pause(): Promise<void>;
    previousTrack(): Promise<void>;
    resume(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    setName(name: string): Promise<void>;
    setVolume(volume: number): Promise<void>;
    togglePlay(): Promise<void>;
  }

  interface SpotifyPlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }

  interface Window {
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => Spotify.Player;
    };
  }
}
