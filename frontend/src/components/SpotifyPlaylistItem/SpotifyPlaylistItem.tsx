import { Card, CardActionArea, CardMedia, Divider, Typography } from '@mui/material';
import React, { FC } from 'react';
import { Playlist } from '../../interfaces/payloads/Playlists.payload';
import styles from './SpotifyPlaylistItem.module.scss';

interface SpotifyPlaylistItemProps {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
}

const SpotifyPlaylistItem: FC<SpotifyPlaylistItemProps> = (props) => {
  const imageUrl = props.playlist.images[0].url;
  return (
    <Card className={styles.SpotifyPlaylistItem} data-testid="SpotifyPlaylistItem">
      <CardActionArea onClick={() => props.onClick(props.playlist)}>
      <CardMedia
        component="img"
        sx={{ width: "100%" }}
        image={imageUrl}
        alt={props.playlist.name + " img"}
      />
      <Divider variant="middle" />
      <Typography variant='subtitle2' noWrap>
        {props.playlist.name}
      </Typography>
      <Divider variant="middle" />
      <Typography variant='caption' color={"#838383"}>
        By {props.playlist.owner.displayName}
      </Typography>
        
      </CardActionArea>
    </Card>
  );
}

export default SpotifyPlaylistItem;
