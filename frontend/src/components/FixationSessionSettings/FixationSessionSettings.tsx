import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Button, Card, CardActions } from '@mui/material';
import React from 'react';
import FixationSettings from '../FixationSettings/FixationSettings';
import { SetFixationSessionSettingsPayload } from '../../interfaces/payloads/SetFixationSessionSettings.payload';
import styles from './FixationSessionSettings.module.scss';
import { Fixation } from '../../interfaces/Fixation';

interface FixationSessionSettingsProps {
  closeModalCallback: () => void;
  startFixationCallback: (settings: SetFixationSessionSettingsPayload) => void;
  selectedFixation: Fixation;
}

const FixationSessionSettings = (props: FixationSessionSettingsProps) => {
  const [state, setState] = React.useState({
    isMultipleChoice: false,
    doShowHints: true,
    isRandomlyShuffled: true,
    doStopOnAnswer: false,
    isSpotifyRandomStart: false,
    timeLimit: 30,
  });

  const setSettings = (event: any, value?: number) => {
    if (value) {
      setState({
        ...state, timeLimit: value
      })
    }
    else {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
    }
  };

  const setFixationSettings = () => {
    let fixationSettings: SetFixationSessionSettingsPayload = {
      fixation_session: -1, // does not exist yet
      show_hints_ind: state.doShowHints,
      multiple_choice_ind: state.isMultipleChoice,
      random_shuffle_ind: state.isRandomlyShuffled,
      stop_on_answer_ind: state.doStopOnAnswer,
      spotify_random_start_ind: state.isSpotifyRandomStart,
      time_limit: state.timeLimit
    }
    props.startFixationCallback(fixationSettings);
  }
  

  return (
    <ClickAwayListener onClickAway={props.closeModalCallback}>
      <Card className={styles.FixationSessionSettings} data-testid="FixationSessionSettings">
        <FixationSettings setSettingsCallback={setSettings} isMusic={props.selectedFixation.spotifyPlaylistId !== ""}/>
        <CardActions className={styles.bottomButtons}>
          <Button size="medium" variant="contained" color="secondary" onClick={props.closeModalCallback} style={{ margin: "10px 20px" }}>Exit</Button>
          <Button size="medium" variant="contained" color="primary" onClick={setFixationSettings} style={{ margin: "0 20px" }}>Start</Button>
        </CardActions>
      </Card>
    </ClickAwayListener>
  );
}

export default FixationSessionSettings;
