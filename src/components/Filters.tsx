import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Tabs, TabItem, CheckboxField } from "@aws-amplify/ui-react";
import { Dropdown } from "react-bootstrap";
import TimeCapsule from "./TimeCapsule";
import Recommendations from "./Recommendations";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { useError } from "../hooks/useError";
import { escapeHTML } from "../utils/escape";
import {
  buildSeasonMap,
  getSeasonRange,
  Season,
} from "../utils/dateUtils";
import { SpotifyPlaylist, SpotifyTrackItem } from "../types/spotify";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";
const ADD_SONGS_TO_PLAYLIST = "https://api.spotify.com/v1/playlists";
const CREATE_CUSTOM_PLAYLIST = "https://api.spotify.com/v1/users";

// small helper
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Genre =
  | "classical"
  | "hip-hop"
  | "chill"
  | "alternative"
  | "disco"
  | "afro-beat";

export interface DataTableRow {
  id: number;
  uri: string;
  name: string;
  artists: string;
  album: string;
  image: string;
  release_date: string;
  popularity: number;
  song_link: string;
}

const years: number[] = [2019, 2020, 2021, 2022];
const seasons: Season[] = ["Spring", "Summer", "Fall", "Winter"];
const genres: Genre[] = [
  "classical",
  "hip-hop",
  "chill",
  "alternative",
  "disco",
  "afro-beat",
];

const seasonMap = buildSeasonMap(years);

const Filters: React.FC = () => {
  const token = useSpotifyAuth();
  const { error, reportError, clearError } = useError();

  // Time Capsule state
  const [userId, setUserId] = useState<string | null>(null);
  const [createdPlaylistId, setCreatedPlaylistId] = useState<string>("");
  const [playlistName, setPlaylistName] = useState<string>("");
  const [songLimit, setSongLimit] = useState<number>(1);
  const [randomSongsLength, setRandomSongsLength] = useState<number>(0);
  const [playlistURIs, setPlaylistURIs] = useState<string[]>([]);
  const [throwError, setThrowError] = useState(false);
  const [createdPlaylistIdsCount, setCreatedPlaylistIdsCount] =
    useState<number>(0);

  const [year, setYear] = useState<number | "">("");
  const [season, setSeason] = useState<Season | "">("");

  // Recommendations state
  const [userSongsList, setUserSongsList] = useState<string[]>([]);
  const [userArtistList, setUserArtistList] = useState<string[]>([]);
  const [userGenresArr, setUserGenresArr] = useState<Genre[]>([]);
  const [dataTableArr, setDataTableArr] = useState<DataTableRow[]>([]);
  const [recommendationsURI, setRecommendationsURI] = useState<string[]>([]);
  const [recommendationPlaylistName, setRecommendationPlaylistName] =
    useState<string>("");
  const [recommendationPlaylistID, setRecommendationPlaylistID] =
    useState<string>("");

  const [checkboxCounter, setCheckboxCounter] = useState(0);
  const [playlistNameDisabled, setPlaylistNameDisabled] = useState(true);
  const [createPlaylistDisabled, setCreatePlaylistDisabled] = useState(true);
  const [addSongsDisabled, setAddSongsDisabled] = useState(true);
  const [recommendationTabEnabled, setRecommendationTabEnabled] =
    useState(false);

  // --- Side effects ---

  // Get userId once we have a token
  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const res = await axios.get(USER_ID_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.id);
      } catch (err) {
        reportError("Failed to load user profile from Spotify.");
      }
    };
    fetchUserId();
  }, [token, reportError]);

  // Fetch playlist count from backend once on mount
  useEffect(() => {
    const getPlaylistIDCount = async () => {
      try {
        const res = await axios.get<{
          count: number;
        }>("http://localhost:8080/api/playlists/playlistIds");
        setCreatedPlaylistIdsCount(res.data.count);
      } catch {
        // silently ignore – not critical for UX
      }
    };
    getPlaylistIDCount();
  }, []);

  // --- UI fragments (dropdowns & checkboxes) ---

  const dropDownOptionsComponent = useMemo(
    () =>
      years.map((y) => (
        <Dropdown.Item key={y} onClick={() => setYear(y)}>
          {y}
        </Dropdown.Item>
      )),
    []
  );

  const dropDownSeasonComponent = useMemo(
    () =>
      seasons.map((s) => (
        <Dropdown.Item key={s} onClick={() => setSeason(s)}>
          {s}
        </Dropdown.Item>
      )),
    []
  );

  const genreCheckboxComponent = useMemo(
    () =>
      genres.map((genre) => (
        <CheckboxField
          key={genre}
          label={genre}
          name={genre}
          value={genre}
          size="default"
          onChange={(e) => {
            const checked = e.target.checked;
            setUserGenresArr((prev) =>
              checked
                ? [...prev, genre]
                : prev.filter((g) => g !== genre)
            );
            setCheckboxCounter((c) => (checked ? c + 1 : c - 1));
          }}
        />
      )),
    []
  );

  // --- Core logic ---

  // Called when user types song limit – also enables Recommendations tab
  const handleSongLimitAndRecommendation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    clearError();
    if (!token) {
      reportError("Please log in with Spotify first.");
      return;
    }

    const raw = escapeHTML(e.target.value);
    const value = Number(raw);

    if (Number.isNaN(value) || value <= 0) {
      setSongLimit(0);
      setRecommendationTabEnabled(false);
      return;
    }

    const finalLimit = Math.min(value, 100);
    setSongLimit(finalLimit);

    if (year && season) {
      loadTimeCapsuleSongs(finalLimit, year, season);
      setRecommendationTabEnabled(true);
    }
  };

  const loadTimeCapsuleSongs = async (
    limit: number,
    selectedYear: number,
    selectedSeason: Season
  ) => {
    if (!token) return;

    setThrowError(false);

    try {
      const playlistsRes = await axios.get<{ items: SpotifyPlaylist[] }>(
        PLAYLIST_ENDPOINT,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allTrackItems: SpotifyTrackItem[] = [];

      for (const playlist of playlistsRes.data.items) {
        const tracksRes = await axios.get<{ items: SpotifyTrackItem[] }>(
          playlist.tracks.href,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        allTrackItems.push(...tracksRes.data.items);
      }

      // seed arrays for recommendations
      setUserSongsList(allTrackItems.map((t) => t.track.id));
      setUserArtistList(
        allTrackItems.map((t) => t.track.artists[0]?.id).filter(Boolean)
      );

      const range = getSeasonRange(seasonMap, selectedYear, selectedSeason);
      if (!range) {
        reportError("Invalid time range selected.");
        return;
      }

      const from = Date.parse(range.start);
      const to = Date.parse(range.end);

      const filtered = allTrackItems.filter((item) => {
        const added = Date.parse(item.added_at);
        return added >= from && added <= to;
      });

      if (filtered.length === 0) {
        setRandomSongsLength(0);
        setPlaylistURIs([]);
        setThrowError(true);
        reportError(
          "No songs found for the selected time frame. Try a different year/season."
        );
        return;
      }

      const shuffled = shuffle(filtered);
      const limited = shuffled.slice(0, limit);
      const uris = limited.map((t) => t.track.uri);

      setRandomSongsLength(uris.length);
      setPlaylistURIs(uris);
    } catch (err) {
      console.error(err);
      setThrowError(true);
      reportError(
        "There was a problem fetching your playlists. You might be rate-limited by Spotify."
      );
    }
  };

  const handlePlaylistName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(escapeHTML(e.target.value));
  };

  const handleCreatePlaylist = async () => {
    if (!token || !userId || !playlistName) return;

    try {
      const res = await axios.post(
        `${CREATE_CUSTOM_PLAYLIST}/${userId}/playlists`,
        {
          name: playlistName,
          description:
            "Time capsule playlist created by Spotify Time Capsule.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCreatedPlaylistId(res.data.id);
      await postPlaylistID(res.data.id);
      alert("Playlist created!");
    } catch (err) {
      reportError("Failed to create playlist.");
    }
  };

  const handleAddSongsToPlaylist = async () => {
    if (!token || !createdPlaylistId || playlistURIs.length === 0) return;

    try {
      const uris = playlistURIs.slice(0, Math.min(songLimit, 100));
      await axios.post(
        `${ADD_SONGS_TO_PLAYLIST}/${createdPlaylistId}/tracks`,
        { uris, position: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setThrowError(true);
      reportError(
        "Could not add songs to your playlist. Try again with a different time frame."
      );
    }
  };

  // Recommendations API URL
  const recommendationsUrl = useMemo(() => {
    if (!userSongsList.length || !userArtistList.length || !userGenresArr.length)
      return null;

    const seedArtist = userArtistList.slice(0, 1).join(",");
    const seedGenres = userGenresArr.join(",");
    const seedTrack = userSongsList[0];

    return (
      "https://api.spotify.com/v1/recommendations" +
      `?seed_artists=${seedArtist}` +
      `&seed_genres=${seedGenres}` +
      `&seed_tracks=${seedTrack}` +
      "&limit=20"
    );
  }, [userSongsList, userArtistList, userGenresArr]);

  const handleGetRecommendations = async () => {
    if (!token || !recommendationsUrl) return;
    clearError();

    try {
      const res = await axios.get(recommendationsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tracks = res.data.tracks as any[];

      const rows: DataTableRow[] = tracks.map((song, index) => ({
        id: index + 1,
        uri: song.uri,
        name: song.name,
        artists: song.artists?.map((a: any) => a.name).join(", "),
        album: song.album?.name,
        image: song.album?.images?.[0]?.url,
        release_date: song.album?.release_date,
        popularity: song.popularity,
        song_link: song.external_urls?.spotify,
      }));

      setDataTableArr(rows);
    } catch (err) {
      reportError("Failed to load recommendations from Spotify.");
    }
  };

  const setRecommendationsCallback = (selectedIds: (string | number)[]) => {
    const selectedRows = dataTableArr.filter((row) =>
      selectedIds.includes(row.id)
    );
    setRecommendationsURI(selectedRows.map((row) => row.uri));
  };

  const handleRecommendationPlaylistNameCallback = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = escapeHTML(e.target.value);
    setRecommendationPlaylistName(name);
  };

  const createRecommendationPlaylist = async () => {
    if (!token || !userId || !recommendationPlaylistName) return;

    try {
      const res = await axios.post(
        `${CREATE_CUSTOM_PLAYLIST}/${userId}/playlists`,
        {
          name: recommendationPlaylistName,
          description: "Playlist created from Spotify Time Capsule suggestions.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRecommendationPlaylistID(res.data.id);
      await postPlaylistID(res.data.id);
      setAddSongsDisabled(false);
    } catch {
      reportError("Failed to create recommendation playlist.");
    }
  };

  const addSongsToRecommendationPlaylist = async () => {
    if (!token || !recommendationPlaylistID || !recommendationsURI.length)
      return;

    try {
      await axios.post(
        `${ADD_SONGS_TO_PLAYLIST}/${recommendationPlaylistID}/tracks`,
        { uris: recommendationsURI, position: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendationsURI([]);
      setAddSongsDisabled(true);
    } catch {
      reportError("Failed to add songs to recommendation playlist.");
    }
  };

  const postPlaylistID = async (playlistId: string) => {
    try {
      await axios.post(
        "http://localhost:8080/api/playlists/",
        { playlistId },
        { headers: { "Content-Type": "application/json" } }
      );
      // refresh count
      const res = await axios.get<{ count: number }>(
        "http://localhost:8080/api/playlists/playlistIds"
      );
      setCreatedPlaylistIdsCount(res.data.count);
    } catch {
      // non-critical for UX
    }
  };

  // columns for DataGrid (typed once here, reused)
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "uri", headerName: "URI", width: 0, hide: true },
      { field: "name", headerName: "Track Name", width: 200 },
      { field: "artists", headerName: "Artist/Artists", width: 250 },
      { field: "album", headerName: "Album", width: 250 },
      {
        field: "image",
        headerName: "Album Cover",
        width: 150,
        renderCell: (params: any) => (
          <img
            height="80px"
            width="80px"
            alt="Album Cover"
            src={params.row.image}
          />
        ),
      },
      { field: "release_date", headerName: "Release Date" },
      {
        field: "popularity",
        headerName: "Popularity (0-100)",
        sortable: true,
        width: 150,
      },
      {
        field: "song_link",
        headerName: "Song Link",
        width: 150,
        renderCell: (params: any) => (
          <a href={params.row.song_link} target="_blank" rel="noreferrer">
            Link
          </a>
        ),
      },
    ],
    []
  );

  return (
    <div>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          {error}
        </p>
      )}
      <Tabs padding="2rem" justifyContent="center">
        <TabItem title="Time Capsule">
          <TimeCapsule
            handleSongLimitAndRecommendationCallback={
              handleSongLimitAndRecommendation
            }
            songLimit={songLimit}
            randomSongsLength={randomSongsLength}
            handlePlaylistNameCallback={handlePlaylistName}
            playlistName={playlistName}
            handleCreatePlaylistCallback={handleCreatePlaylist}
            handleAddSongsToPlaylistCallback={handleAddSongsToPlaylist}
            dropDownOptionsComponent={dropDownOptionsComponent}
            dropDownSeasonComponent={dropDownSeasonComponent}
            year={year}
            season={season}
            throwErrorState={throwError}
            createdPlaylistIdsCount={createdPlaylistIdsCount}
          />
        </TabItem>
        <TabItem
          title="Recommendations"
          disabled={!recommendationTabEnabled}
        >
          <Recommendations
            dataTableArr={dataTableArr}
            columns={columns}
            handleGetRecommendationsCallback={handleGetRecommendations}
            genreCheckboxComponent={genreCheckboxComponent}
            setRecommendationsCallback={setRecommendationsCallback}
            handleRecommendationPlaylistNameCallback={
              handleRecommendationPlaylistNameCallback
            }
            createRecommendationPlaylistCallback={createRecommendationPlaylist}
            addSongsToRecommendationPlaylistCallback={
              addSongsToRecommendationPlaylist
            }
            checkboxCounter={checkboxCounter}
            setHandlePlaylistNameCheck={setPlaylistNameDisabled}
            setCreatePlaylistCheck={setCreatePlaylistDisabled}
            handleCreatePlaylistCheck={createPlaylistDisabled}
            handlePlaylistNameCheck={playlistNameDisabled}
            setAddSongsButton={setAddSongsDisabled}
            handleAddSongsButton={addSongsDisabled}
            setRecommendationsURI={setRecommendationsURI}
          />
        </TabItem>
      </Tabs>
    </div>
  );
};

export default Filters;
