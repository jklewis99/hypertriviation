import React, { FC, useEffect } from 'react';
import SpotifyPlaylistItem from '../SpotifyPlaylistItem/SpotifyPlaylistItem';
import styles from './SpotifyPlaylistList.module.scss';
import { Playlist } from "../../interfaces/payloads/Playlists.payload";
import { ClickAwayListener, Grid } from '@mui/material';

interface SpotifyPlaylistListProps {
  playlists: Playlist[];
  closeModalCallback: () => void;
  selectPlaylistCallback: (playlist: Playlist) => void;
}

const SpotifyPlaylistList: FC<SpotifyPlaylistListProps> = (props) => {
  return (
    <ClickAwayListener onClickAway={props.closeModalCallback}>
      <div className={styles.SpotifyPlaylistList} data-testid="SpotifyPlaylistList">
        <Grid
        
          container
          rowSpacing={{ xs: 1, sm: 2, md: 2 }}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          {props.playlists.map((playlist) => (
            <Grid item xs={3} zeroMinWidth>
              <SpotifyPlaylistItem playlist={playlist} onClick={props.selectPlaylistCallback}/>
            </Grid>
          ))}
        </Grid>
      </div>
    </ClickAwayListener>
  );
}

export default SpotifyPlaylistList;
