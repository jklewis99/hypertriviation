import * as React from 'react';

import { checkTracksStatus, removeTracks, saveTracks } from '../spotify';
import { Locale, StyledProps, StylesOptions } from '../types/common';
import { SpotifyPlayerTrack } from '../types/spotify';
import { duration, Typography } from '@mui/material';
import styles from '../ReactSpotifyWebPlayback.module.scss';
import AlbumCoverHolder from './AlbumCoverHolder';
import SongInfoReveal from './SongInfoReveal';

interface Props {
  isActive: boolean;
  locale: Locale;
  onFavoriteStatusChange: (status: boolean) => any;
  showSaveIcon: boolean;
  styles: StylesOptions;
  token: string;
  track: SpotifyPlayerTrack;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
  timeRemainingMs: number;
  duration: number; //TODO
  showHints: boolean;
}

interface State {
  isSaved: boolean;
  albumImage: HTMLImageElement | null;
  duration: number;
}

export default class Info extends React.PureComponent<Props, State> {
  private isActive = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSaved: false,
      albumImage: null,
      duration: props.duration
    };
  }

  public async componentDidMount() {
    this.isActive = true;

    const { showSaveIcon, track } = this.props;

    if (showSaveIcon && track.id) {
      await this.setStatus();
    }
  }

  public async componentDidUpdate(previousProps: Props) {
    const { showSaveIcon, track } = this.props;

    if (previousProps.track.id !== track.id && track.id) {
      if (showSaveIcon) {
        this.updateState({ isSaved: false });
  
        await this.setStatus();
      }
      // else if (track.artists && previousProps.duration !== this.state.duration) {
        // debugger;
        this.updateState({
          duration: Math.min(this.props.duration, this.props.timeRemainingMs),
        })
      
      this.setImage();
    }

  }

  public componentWillUnmount() {
    this.isActive = false;
  }

  private setStatus = async () => {
    if (!this.isActive) {
      return;
    }

    const { onFavoriteStatusChange, token, track, updateSavedStatus } = this.props;

    if (updateSavedStatus && track.id) {
      updateSavedStatus((newStatus: boolean) => {
        this.updateState({ isSaved: newStatus });
      });
    }

    const status = await checkTracksStatus(token, track.id);
    const [isSaved] = status || [false];

    this.updateState({ isSaved });
    onFavoriteStatusChange(isSaved);
  };

  private updateState = (state = {}) => {
    if (!this.isActive) {
      return;
    }

    this.setState(state);
  };

  private setImage = () => {
    let image = document.getElementById('album-image') as HTMLImageElement;
    if (image) {
      this.updateState({ albumImage: image })
    }
  };

  public render() {
    const {
      isActive,
      track: { name, image, artists = [] },
    } = this.props;

    const classes = [];

    if (isActive) {
      classes.push(styles.mediaPlayer);
    }
    const artistNames = artists ? artists?.map(d => d.name).join(', ') : "";
    return (
      <div className={styles.mediaPlayer}>
        {image && (
          <AlbumCoverHolder id="album-image" alt={name} src={image} durationMs={this.state.duration} doShow={this.props.showHints}/>
        )}
        {!!name && (
          <div>
            <SongInfoReveal variant='h5' name={name} duration={this.state.duration} revealPace={Math.floor(this.state.duration / (name.length || 1))} doShow={this.props.showHints} />
            <span style={{fontSize: "1em"}}>Song Title</span>
            {/* <Typography variant='h6'>
              {name}
            </Typography> */}
            <SongInfoReveal variant='h6' name={artistNames} duration={this.state.duration} revealPace={Math.floor(this.state.duration / (artistNames.length || 1))} doShow={this.props.showHints}/>
            <span>Artist/Composer</span>
          </div>
        )}
      </div>
    );
  }
}
