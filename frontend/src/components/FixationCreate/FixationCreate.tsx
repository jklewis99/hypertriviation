import { Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormGroup, Input, InputLabel, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewFixationValues } from '../../interfaces/NewFixationValues';
import { Playlist, PlaylistsResponse } from '../../interfaces/payloads/Playlists.payload';
import { SetFixationSessionSettingsPayload } from '../../interfaces/payloads/SetFixationSessionSettings.payload';
import { createFixation } from '../../services/fixation.service';
import { getPlaylists } from '../../services/spotify.service';
import FixationSettings from '../FixationSettings/FixationSettings';
import SpotifyPlaylistItem from '../SpotifyPlaylistItem/SpotifyPlaylistItem';
import SpotifyPlaylistList from '../SpotifyPlaylistList/SpotifyPlaylistList';
import styles from './FixationCreate.module.scss';

interface FixationCreateProps {
  userId: number;
}

const FixationCreate: FC<FixationCreateProps> = (props) => {
  const navigate = useNavigate();
  const [fixationCategory, setFixationCategory] = useState<string>();
  // TODO: Change to Interface or user Fixation interface
  const [newFixationValues, setNewFixationValues] = useState<NewFixationValues>({
    title: "",
    description: "",
    imgUrl: "",
    spotifyPlaylist: "",
    createdBy: props.userId,
    category: "",
    randomShuffleInd: false
  });
  const [newFixationSettings, setNewFixationSettings] = useState({
    isMultipleChoice: false,
    doShowHints: true,
    isRandomlyShuffled: true,
    doStopOnAnswer: false,
    isSpotifyRandomStart: false,
    timeLimit: 30,
  });  
  const [isSpotifyPlaylistListOpen, setIsSpotifyPlaylistListOpen] = useState<boolean>(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();

  // TODO: Do not hard code these values...
  const fixationCategories: string[] = [
    "Music",
    "Secret Codes",
    "Other"
  ];

  const setSettings = (event: any, value?: number) => {
    if (value) {
      setNewFixationSettings({
        ...newFixationSettings,
        timeLimit: value
      })
    }
    else {
      setNewFixationSettings({
        ...newFixationSettings,
        [event.target.name]: event.target.checked,
      });
    }
  };

  const getMyPlaylists = () => {
    // trivial client-side cache solution
    // TODO: add refresh button or timer to retrieve newly created/saved playlists
    if (spotifyPlaylists.length === 0) {
      getPlaylists(1).then(
        (data: PlaylistsResponse) => {
          setSpotifyPlaylists(data.items);
          console.log(data.items)
        }
      )
    }
    setIsSpotifyPlaylistListOpen(true);
  }

  const setFixationSettings = () => {
    createFixation(newFixationValues)
      .then((fixation) => {
        if (fixation.category !== "Music") {
          navigate(`/fixations/create/${fixation.id}`, { state: [fixation.id , 1] }); // TODO: pass id in only one place
        }
        else {
          navigate("/");
        }
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }

  const handleChange = (prop: any, event: any) => {
    setNewFixationValues({ ...newFixationValues, [prop]: event.target.value });
  }

  const handleCategoryChange = (event: any, value: string) => {
    setNewFixationValues({ ...newFixationValues, category: value });
  }

  const handleClosePopup = () => setIsSpotifyPlaylistListOpen(false);

  const selectPlaylist = (playlist: Playlist) => {
    console.log(playlist);
    setSelectedPlaylist(playlist);
    setNewFixationValues({ ...newFixationValues, imgUrl: playlist.images[0].url, spotifyPlaylist: playlist.id });
    handleClosePopup();
  } 

  return (
    <div className={styles.FixationCreate} data-testid="FixationCreate">
      <Card className="main-card">
        <CardHeader title="Create New Fixation" />
        <Divider />
        <CardContent>
          <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
          <ToggleButtonGroup
            value={newFixationValues.category}
            exclusive
            onChange={handleCategoryChange}
            aria-label="category type"
          // className={styles.timeLimitOptions}
          // style={isSmallScreen ? { flexDirection: "column" } : { flexDirection: "row" }}
          >
            {
              fixationCategories.map(category => (
                <ToggleButton value={category}>
                  <Typography>{category}</Typography>
                </ToggleButton>
              ))
            }
          </ToggleButtonGroup>
          {newFixationValues.category === "Music"
            ?
            <CardContent >
              {
                selectedPlaylist
                ?
                <div className={styles.playlistContainer}>
                  <div style={{width: "100%", maxWidth: "400px"}}>
                    <SpotifyPlaylistItem playlist={selectedPlaylist} onClick={selectPlaylist} orientation={true}/>
                  </div>
                </div>
                :
                null
              }
              {/* {selectedPlaylist ? "Playlist: " + selectedPlaylist.name : null } */}
              <Button onClick={getMyPlaylists}>{newFixationValues.spotifyPlaylist ? "Change" : "Choose a Playlist"}</Button>
            </CardContent>
            :
            null
          }

          <FormControl required fullWidth margin="normal" sx={{zIndex: 0}}>
            <TextField
              name="title"
              label="Fixation Title"
              required
              className={styles.inputs}
              onChange={(event) => handleChange("title", event)}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal" sx={{zIndex: 0}}>
            <TextField
              name="description"
              label="Description"
              required
              className={styles.inputs}
              multiline
              maxRows={4}
              inputProps={{ maxLength: 240 }}
              onChange={(event) => handleChange("description", event)}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal" sx={{zIndex: 0}}>
            <TextField
              name="imageUrl"
              label="Image URL"
              required
              className={styles.inputs}
              value={newFixationValues.imgUrl}
              onChange={(event) => handleChange("imgUrl", event)}
            />
          </FormControl>

        </CardContent>
        <FixationSettings setSettingsCallback={setSettings} isMusic={newFixationValues.spotifyPlaylist !== ""}/>
        <CardActions className="card-actions">
          <Button size="medium" variant="contained" color="secondary" onClick={() => navigate(-1)} style={{ margin: "10px 20px" }}>Exit</Button>
          <Button size="medium" variant="contained" color="primary" onClick={setFixationSettings} style={{ margin: "0 20px" }}>
            {
              newFixationValues.category === "Music"
              ?
              "Create"
              : 
              "Start"
            }
          </Button>
        </CardActions>
      </Card>
      {
        isSpotifyPlaylistListOpen
        ?
        <div className="pop-up-module" >
          <SpotifyPlaylistList playlists={spotifyPlaylists} closeModalCallback={handleClosePopup} selectPlaylistCallback={selectPlaylist}/>
        </div>
        : null}
    </div>
  );
}

export default FixationCreate;
