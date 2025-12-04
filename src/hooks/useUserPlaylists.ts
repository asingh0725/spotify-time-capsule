import { useState } from "react";
import { spotifyGet } from "../api/spotifyApi";
import { SpotifyTrackItem, SpotifyPlaylist } from "../types/spotify";

const PLAYLISTS_URL = "https://api.spotify.com/v1/me/playlists?limit=50";

export function useUserPlaylists(token: string | null) {
  const [tracks, setTracks] = useState<SpotifyTrackItem[]>([]);
  const [songs, setSongs] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);

  async function loadPlaylists() {
    if (!token) return;

    const data = await spotifyGet<{ items: SpotifyPlaylist[] }>(
      PLAYLISTS_URL,
      token
    );

    for (const playlist of data.items) {
      await loadPlaylistTracks(playlist.tracks.href);
    }
  }

  async function loadPlaylistTracks(url: string) {
    if (!token) return;

    const data = await spotifyGet<{ items: SpotifyTrackItem[] }>(url, token);

    data.items.forEach((item) => {
      setTracks((prev) => [...prev, item]);
      setSongs((prev) => [...prev, item.track.id]);
      setArtists((prev) => [...prev, item.track.artists[0].id]);
    });
  }

  return { songs, artists, tracks, loadPlaylists };
}