import React from "react";
import { Flex, Button, Heading, TextField } from "@aws-amplify/ui-react";
import { DataGrid, GridSelectionModel, GridColDef } from "@mui/x-data-grid";
import { DataTableRow } from "./Filters";

interface RecommendationsProps {
  dataTableArr: DataTableRow[];
  columns: GridColDef[];
  handleGetRecommendationsCallback: () => void;
  genreCheckboxComponent: React.ReactNode;
  setRecommendationsCallback: (items: GridSelectionModel) => void;
  handleRecommendationPlaylistNameCallback: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  createRecommendationPlaylistCallback: () => void;
  addSongsToRecommendationPlaylistCallback: () => void;
  checkboxCounter: number;
  setHandlePlaylistNameCheck: (value: boolean) => void;
  handlePlaylistNameCheck: boolean;
  setCreatePlaylistCheck: (value: boolean) => void;
  handleCreatePlaylistCheck: boolean;
  setAddSongsButton: (value: boolean) => void;
  handleAddSongsButton: boolean;
  setRecommendationsURI: (uris: string[]) => void;
}

const Recommendations: React.FC<RecommendationsProps> = (props) => {
  const {
    dataTableArr,
    columns,
    handleGetRecommendationsCallback,
    genreCheckboxComponent,
    setRecommendationsCallback,
    handleRecommendationPlaylistNameCallback,
    createRecommendationPlaylistCallback,
    addSongsToRecommendationPlaylistCallback,
    checkboxCounter,
    setHandlePlaylistNameCheck,
    handlePlaylistNameCheck,
    setCreatePlaylistCheck,
    handleCreatePlaylistCheck,
    setAddSongsButton,
    handleAddSongsButton,
    setRecommendationsURI,
  } = props;

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
      padding="2rem"
      gap="1rem"
    >
      <Heading level={1}>Select Your Genre</Heading>

      <Flex
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
      >
        {genreCheckboxComponent}
      </Flex>

      <Button
        onClick={handleGetRecommendationsCallback}
        variation="primary"
        size="large"
        ariaLabel="Get song recommendations button"
        disabled={checkboxCounter === 0 || checkboxCounter > 3}
      >
        GET SONG RECOMMENDATIONS
      </Button>

      <Flex
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
        height="625px"
        width="1760px"
      >
        <DataGrid
          rows={dataTableArr}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowHeight={100}
          onSelectionModelChange={(items) => {
            if (items.length === 0) {
              setHandlePlaylistNameCheck(true);
            } else {
              setHandlePlaylistNameCheck(false);
            }
            setRecommendationsCallback(items);
          }}
        />
        <Flex direction="column" padding="2rem" gap="0.5rem">
          <TextField
            ariaLabel="Choose playlist name input"
            type="text"
            id="playlistName"
            name="playlistName"
            variation="quiet"
            placeholder="Choose a playlist name"
            isRequired
            padding="1rem"
            disabled={handlePlaylistNameCheck}
            onChange={(e) => {
              handleRecommendationPlaylistNameCallback(e);
              if (e.target.value.trim() !== "") {
                setCreatePlaylistCheck(false);
              } else {
                setCreatePlaylistCheck(true);
              }
            }}
          />
          <Button
            ariaLabel="Create playlist button"
            disabled={handleCreatePlaylistCheck}
            onClick={() => {
              createRecommendationPlaylistCallback();
              setAddSongsButton(false);
            }}
          >
            CREATE PLAYLIST
          </Button>
          <Button
            ariaLabel="Add songs to the playlist button"
            disabled={handleAddSongsButton}
            onClick={() => {
              addSongsToRecommendationPlaylistCallback();
              setRecommendationsURI([]);
            }}
          >
            ADD SONGS TO THE PLAYLIST
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Recommendations;

export default Recommendations;
