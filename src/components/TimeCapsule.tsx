import React from "react";
import {
  TextField,
  Flex,
  View,
  Button,
  Text,
} from "@aws-amplify/ui-react";
import { Dropdown } from "react-bootstrap";
import { Season } from "../utils/dateUtils";

interface TimeCapsuleProps {
  handleSongLimitAndRecommendationCallback: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  songLimit: number;
  randomSongsLength: number;
  handlePlaylistNameCallback: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  playlistName: string;
  handleCreatePlaylistCallback: () => void;
  handleAddSongsToPlaylistCallback: () => void;
  year: number | "";
  season: Season | "";
  dropDownOptionsComponent: React.ReactNode;
  dropDownSeasonComponent: React.ReactNode;
  throwErrorState: boolean;
  createdPlaylistIdsCount: number;
}

const TimeCapsule: React.FC<TimeCapsuleProps> = ({
  handleSongLimitAndRecommendationCallback,
  songLimit,
  randomSongsLength,
  handlePlaylistNameCallback,
  playlistName,
  handleCreatePlaylistCallback,
  handleAddSongsToPlaylistCallback,
  year,
  season,
  dropDownOptionsComponent,
  dropDownSeasonComponent,
  throwErrorState,
  createdPlaylistIdsCount,
}) => {
  const isTimeframeSelected = !!season && !!year;

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" gap="1rem">
      {/* Error modal */}
      {throwErrorState && (
        <Flex direction="column" alignItems="center" gap="1rem" padding="2rem">
          <Text
            color="red"
            fontSize="0.85rem"
            textAlign="center"
            aria-label="Invalid timeframe error"
          >
            Error: No songs found or rate limit exceeded.  
            Try another timeframe.
          </Text>

          <Button variation="primary" onClick={() => window.location.reload()}>
            OK
          </Button>
        </Flex>
      )}

      {/* Selection card */}
      <View
        as="div"
        borderRadius="6px"
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        padding="1.5rem"
        width="100%"
        maxWidth="600px"
      >
        <Dropdown style={{ paddingBottom: "1rem" }}>
          <Dropdown.Toggle variant="success">SEASON</Dropdown.Toggle>
          <Dropdown.Menu>{dropDownSeasonComponent}</Dropdown.Menu>
        </Dropdown>

        <Dropdown style={{ paddingBottom: "1rem" }}>
          <Dropdown.Toggle variant="success">YEAR</Dropdown.Toggle>
          <Dropdown.Menu>{dropDownOptionsComponent}</Dropdown.Menu>
        </Dropdown>

        {isTimeframeSelected ? (
          <Text color="#188754" fontWeight={600} fontSize="1rem">
            Your time frame is {season}, {year}
          </Text>
        ) : (
          <Text fontWeight={600} fontSize="1rem">
            Select a season and year
          </Text>
        )}

        {/* Song limit input */}
        <TextField
          label="Number of Songs"
          aria-label="Song limit input"
          type="number"
          variation="quiet"
          placeholder="Enter number of songs"
          isDisabled={!isTimeframeSelected}
          isRequired
          onChange={handleSongLimitAndRecommendationCallback}
          marginTop="1rem"
        />

        {!!randomSongsLength && (
          <Text fontSize="0.8rem" marginTop="0.5rem" color="#188754">
            {randomSongsLength} songs found in this timeframe. Maximum 100 allowed.
          </Text>
        )}

        {/* Playlist name */}
        <TextField
          label="Playlist Name"
          aria-label="Playlist name input"
          type="text"
          variation="quiet"
          placeholder="Choose a playlist name"
          isRequired
          onChange={handlePlaylistNameCallback}
          marginTop="1rem"
        />
      </View>

      {/* Buttons */}
      <Button
        variation="primary"
        aria-label="Create playlist"
        onClick={handleCreatePlaylistCallback}
        isDisabled={!playlistName.trim()}
      >
        CREATE PLAYLIST
      </Button>

      <Button
        variation="primary"
        aria-label="Add songs to playlist"
        onClick={handleAddSongsToPlaylistCallback}
      >
        ADD SONGS TO PLAYLIST
      </Button>

      <Text fontSize="0.75rem">Songs may repeat based on your library.</Text>

      {createdPlaylistIdsCount > 0 && (
        <Text fontSize="1rem">
          Users have created <strong>{createdPlaylistIdsCount}</strong> playlists since 2022.
        </Text>
      )}
    </Flex>
  );
};

export default TimeCapsule;
