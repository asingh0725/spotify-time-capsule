export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

/** The actual track object returned by Spotify */
export interface SpotifyTrackFull {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: {
    spotify: string;
  };
}

/** Playlist item wrapper */
export interface SpotifyTrackItem {
  added_at: string;
  track: SpotifyTrackFull;
}

/** Playlist metadata object */
export interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: {
    href: string;
  };
}
