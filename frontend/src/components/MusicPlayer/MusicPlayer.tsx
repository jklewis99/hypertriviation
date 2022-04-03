import { PauseCircleOutline, SkipNext } from '@mui/icons-material';
import { Button, Card, Grid, IconButton, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './MusicPlayer.module.scss';
import SpotifyPlayer, { CallbackState } from '../ReactSpotifyWebPlayback/index';
import { getTokens, setToShuffle } from '../../services/spotify.service';
import { MusicPlayerProps } from '../../interfaces/props/SpotifyWebPlayer.props';
import { CurrentSong } from '../../interfaces/CurrentSong';
import { idConstants } from '../../utils/constants';

const MusicPlayer = (props: MusicPlayerProps) => {
  const [token, setToken] = useState("");
  const [currentSong, setCurrentSong] = useState<CurrentSong>();
  const [deviceId, setDeviceId] = useState("");
  const spotifyPlayerClass = "PlayerRSWP";
  let skipButton: HTMLElement;
  const [togglePlayButton, setTogglePlayButton] = useState<HTMLElement>();
  const [toggleNextButton, setToggleNextButton] = useState<HTMLElement>();
  let isFirstPlay = true;
  const spotifyUri = props.spotifyUri;
  const playlistOffset = props.playlistOffset;
  const songOffset = props.songOffset;

  useEffect(() => {
    console.log("MUSIC PROPS: ", playlistOffset, songOffset);
    getTokens(1).then((data) => {
      setToken(data.accessToken);
    })
      .catch((error: Error) => console.log(error.message));
  }, [])

  const aCallback = (state: CallbackState) => {
    console.log(state);
    let artistList = "";
    for (let artist of state.track.artists) {
      artistList += artist.name + " ";
    }
    setCurrentSong({
      title: state.track.name,
      imgUrl: state.track.image,
      artist: artistList
    })
    setDeviceId(state.deviceId);
  }

  const setButtons = () => {
    var playToggle = document.getElementById(idConstants.playToggle);
    var nextToggle = document.getElementById(idConstants.nextToggle);
    if (playToggle) {
      setTogglePlayButton(playToggle);
      console.log(playToggle);
    }
    if (nextToggle) {
      setToggleNextButton(nextToggle);
      console.log(nextToggle);
    }
  }

  const togglePlay = () => {
    if (isFirstPlay) {
      shuffle();
      setButtons();
      isFirstPlay = false
    }
    console.log(togglePlayButton);
    togglePlayButton?.click();
  }

  const shuffle = () => {
    debugger;
    setTimeout( () => setToShuffle(true).then((response) => { console.log(response); return; }), 2000);
  }

  return (
    <div className={styles.MusicPlayer} data-testid="MusicPlayer">
      <Card>
        {token !== "" ?
          <SpotifyPlayer token={token} uris={spotifyUri} callback={aCallback} offset={playlistOffset} position={songOffset}/>
          :
          null}

        <Button onClick={togglePlay}> Play </Button>
        {/* <Grid container alignItems="center">
          <Grid item xs={4}>
            <img src={currentSong?.imgUrl} height="100%" width="100%" />
          </Grid>
          <Grid item xs={8}>
            <Typography component="h5" variant="h5">
              {currentSong?.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {currentSong?.artist}
            </Typography>
          </Grid>
        </Grid> */}
      </Card>
    </div>
  );
}

export default MusicPlayer;
