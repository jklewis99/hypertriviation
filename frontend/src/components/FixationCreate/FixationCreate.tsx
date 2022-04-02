import { Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormGroup, Input, InputLabel, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistsResponse } from '../../interfaces/payloads/Playlists.payload';
import { SetFixationSessionSettings } from '../../interfaces/payloads/SetFixationSessionSettings.payload';
import { createFixation } from '../../services/fixation.service';
import { getPlaylists } from '../../services/spotify.service';
import FixationSettings from '../FixationSettings/FixationSettings';
import styles from './FixationCreate.module.scss';

interface FixationCreateProps {
  userId: number;
}

const FixationCreate: FC<FixationCreateProps> = (props) => {
  const navigate = useNavigate();
  const [fixationCategory, setFixationCategory] = useState<string>();
  const [newFixationValues, setNewFixationValues] = useState({
    title: "",
    description: "",
    imgUrl: "",
    spotifyPlaylist: null,
    createdBy: props.userId
  });

  // TODO: Do not hard code these values...
  const fixationCategories: string[] = [
    "Music",
    "Secret Codes",
    "Other"
  ];

  const [newFixationSettings, setNewFixationSettings] = useState({
    isMultipleChoice: false,
    doShowHints: true,
    isRandomlyShuffled: true,
    doStopOnAnswer: false,
    timeLimit: 30,
  });

  const setSettings = (event: any, value?: number) => {
    if (value) {
      setNewFixationSettings({
        ...newFixationSettings, timeLimit: value
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
    getPlaylists(1).then(
      (data: PlaylistsResponse) => {
        console.log(data.items)
      }
    )
  }

  const setFixationSettings = () => {
    let fixationSettings: SetFixationSessionSettings = {
      fixation_session_code: "", // does not exist yet
      show_hints_ind: newFixationSettings.doShowHints,
      multiple_choice_ind: newFixationSettings.isMultipleChoice,
      random_shuffle_ind: newFixationSettings.isRandomlyShuffled,
      stop_on_answer_ind: newFixationSettings.doStopOnAnswer,
      time_limit: newFixationSettings.timeLimit
    };
    console.log(fixationSettings);
    createFixation(newFixationValues)
      .then((fixation) => {
        navigate(`/fixations/create/${fixation.id}`, { state: [fixation.id , 1] }); // TODO: pass id in only one place
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
    // props.startFixationCallback(fixationSettings);
  }

  const handleChange = (prop: any, event: any) => {
    setNewFixationValues({ ...newFixationValues, [prop]: event.target.value });
  }

  const handleCategoryChange = (event: any, value: string) => setFixationCategory(value);

  return (
    <div className={styles.FixationCreate} data-testid="FixationCreate">
      <Card className="main-card">
        <CardHeader title="Create New Fixation" />
        <Divider />
        <CardContent>
          <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
          <ToggleButtonGroup
            value={fixationCategory}
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
          {fixationCategory === "Music"
            ?
            <Button onClick={getMyPlaylists}>Choose a Playlist</Button>
            :
            null
          }

          <FormControl required fullWidth margin="normal">
            <TextField
              name="title"
              label="Fixation Title"
              required
              className={styles.inputs}
              onChange={(event) => handleChange("title", event)}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
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
          <FormControl required fullWidth margin="normal">
            <TextField
              name="imageUrl"
              label="Image URL"
              required
              className={styles.inputs}
              // multiline
              // maxRows={4}
              onChange={(event) => handleChange("imgUrl", event)}
            />
          </FormControl>

        </CardContent>
        <FixationSettings setSettingsCallback={setSettings} />
        <CardActions className="card-actions">
          <Button size="medium" variant="contained" color="secondary" onClick={() => navigate(-1)} style={{ margin: "10px 20px" }}>Exit</Button>
          <Button size="medium" variant="contained" color="primary" onClick={setFixationSettings} style={{ margin: "0 20px" }}>Start</Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default FixationCreate;
