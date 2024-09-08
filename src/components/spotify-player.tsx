'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

// Define types for Spotify objects
type SpotifyTrack = {
  name: string
  artists: { name: string }[]
  album: { name: string }
}

type SpotifyPlaylist = {
  id: string
  name: string
}

type SpotifyPlayerProps = {
  accessToken: string
}

export function SpotifyPlayer({ accessToken }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [volume, setVolume] = useState(50)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(accessToken) },
        volume: 0.5
      })

      setPlayer(player)

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
        setDeviceId(device_id)
      })

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
      })

      player.addListener('player_state_changed', (state) => {
        if (!state) return

        setCurrentTrack(state.track_window.current_track)
        setIsPlaying(!state.paused)
      })

      player.connect()
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [accessToken])

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setPlaylists(data.items)
    }

    fetchPlaylists()
  }, [accessToken])

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay()
    }
  }

  const handlePrevTrack = () => {
    if (player) {
      player.previousTrack()
    }
  }

  const handleNextTrack = () => {
    if (player) {
      player.nextTrack()
    }
  }

  const handlePlaylistChange = async (playlistId: string) => {
    if (deviceId) {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (player) {
      player.setVolume(volumeValue / 100)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spotify Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{currentTrack?.name || 'No track playing'}</h3>
            <p className="text-sm text-gray-500">
              {currentTrack?.artists.map(a => a.name).join(', ')} - {currentTrack?.album.name}
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={handlePrevTrack} size="icon" variant="outline">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={handlePlayPause} size="icon">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={handleNextTrack} size="icon" variant="outline">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <label htmlFor="volume-control" className="text-sm font-medium">
              Volume
            </label>
            <Slider
              id="volume-control"
              max={100}
              step={1}
              value={[volume]}
              onValueChange={handleVolumeChange}
            />
          </div>
          <Select onValueChange={handlePlaylistChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}