import React, { useState } from 'react';
import styles from './FixationSettings.module.scss';
import {
  Card, CardHeader, CardContent, CardMedia, CardActions, Typography, Button,
  Dialog, MenuItem, Grid, ClickAwayListener, Divider, FormControl, Switch, Select,
  InputLabel, FormControlLabel, FormGroup, ToggleButton, ToggleButtonGroup, useMediaQuery
} from "@mui/material";
import { TimeLimit } from '../../interfaces/TimeLimit';
import { FixationSessionSettings } from '../../interfaces/FixationSessionSettings';
import { SetFixationSessionSettings } from '../../interfaces/payloads/SetFixationSessionSettings.payload';

interface FixationSettingsProps {
  setSettingsCallback: (event: any, value?: number) => void;
}

const FixationSettings = (props: FixationSettingsProps) => {
  const timeLimitOptions: TimeLimit[] = [
    { time: 30, label: "30 seconds" },
    { time: 60, label: "1 minute" },
    { time: 120, label: "2 minutes" },
    { time: 1e6, label: "No Time Limit" },
  ]
  const [timeLimit, setTimeLimit] = useState<number>(timeLimitOptions[0].time);

  const [state, setState] = React.useState({
    isMultipleChoice: false,
    doShowHints: true,
    isRandomlyShuffled: true,
    doStopOnAnswer: false,
  });

  const handleChange = (event: any) => {
    props.setSettingsCallback(event);
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const handleTimeLimitChange = (event: any, value: number) => {
    setTimeLimit(value);
    props.setSettingsCallback(event, value);
  }

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down("xs"));

  return (
    <CardContent>
      <InputLabel id="demo-simple-select-label">Time Limit</InputLabel>
      <ToggleButtonGroup
        value={timeLimit}
        exclusive
        onChange={handleTimeLimitChange}
        aria-label="time limit"
        className={styles.timeLimitOptions}
        style={isSmallScreen ? { flexDirection: "column" } : { flexDirection: "row" }}
      >
        {
          timeLimitOptions.map(timeLimit => (
            <ToggleButton value={timeLimit.time}>
              <Typography>{timeLimit.label}</Typography>
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>
      <FormControl fullWidth variant="filled">

        <FormGroup style={{flexDirection: 'row', justifyContent: 'center'}}>
          <FormControlLabel
            control={
              <Switch
                checked={state.isMultipleChoice}
                onChange={handleChange}
                name="isMultipleChoice"
              />}
            label="Multiple Choice"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.doShowHints}
                onChange={handleChange}
                name="doShowHints"
              />}
            label="Show Hints"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.isRandomlyShuffled}
                onChange={handleChange}
                name="isRandomlyShuffled"
              />}
            label="Shuffle Questions"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.doStopOnAnswer}
                onChange={handleChange}
                name="doStopOnAnswer"
              />}
            label="Stop on Answer"
          />
        </FormGroup>
      </FormControl>
    </CardContent>
  );
}

export default FixationSettings;
