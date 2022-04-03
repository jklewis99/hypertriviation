import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import React, { FC } from 'react';
import { Playlist } from '../../interfaces/payloads/Playlists.payload';
import styles from './SpotifyPlaylistItem.module.scss';

interface SpotifyPlaylistItemProps {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
  orientation?: boolean;
}

const SpotifyPlaylistItem: FC<SpotifyPlaylistItemProps> = (props) => {
  const imageUrl = props.playlist.images[0].url;
  return (
    // <Card
    //   className={`${props.orientation ? styles.SpotifyPlaylistItemHorizontal : styles.SpotifyPlaylistItem}`}
    //   data-testid="SpotifyPlaylistItem"
    // >
    <CardActionArea
      onClick={() => props.onClick(props.playlist)}
      className={styles.SpotifyPlaylistItem}
      data-testid="SpotifyPlaylistItem"
    >
      <Card
        className={`${props.orientation ? styles.SpotifyPlaylistItemHorizontal : styles.SpotifyPlaylistItemVertical}`}
      >
        <CardMedia
          component="img"
          sx={props.orientation ? { maxHeight: "75px", maxWidth: "75px" } : { width: "100%" } }
          image={imageUrl}
          alt={props.playlist.name + " img"}
        />
        {/* <Divider variant="middle" /> */}
        <Box
          sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "ellipsis",
              padding: "8px 2px"
            }}
        >
          {/* <CardContent > */}
            <Typography width={"100%"} variant='subtitle2' noWrap>
              {props.playlist.name}
            </Typography>
            <Divider variant="middle" />
            <Typography width={"100%"} variant='caption' color={"#838383"}>
              By {props.playlist.owner.displayName}
            </Typography>  
          {/* </CardContent> */}
        </Box>
      </Card>
        {/* <Divider variant="middle" />
        <Typography variant='subtitle2' noWrap>
          {props.playlist.name}
        </Typography>
        <Divider variant="middle" />
        <Typography variant='caption' color={"#838383"}>
          By {props.playlist.owner.displayName}
        </Typography>         */}
    </CardActionArea>
  );
}

export default SpotifyPlaylistItem;
