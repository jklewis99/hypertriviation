import * as React from 'react';

import { px, styled } from '../styles';
import { Locale, StyledProps, StylesOptions } from '../types/common';
import { WebPlaybackTrack } from '../types/spotify';
import { PauseOutlined, PlayArrow, SkipNext } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import styles from '../ReactSpotifyWebPlayback.module.scss';
import { idConstants } from '../../../utils/constants';

interface Props {
  isExternalDevice: boolean;
  isPlaying: boolean;
  locale: Locale;
  nextTracks: WebPlaybackTrack[];
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  previousTracks: WebPlaybackTrack[];
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {},
  ({ style }: StyledProps) => ({
    alignItems: 'center',
    display: 'flex',
    height: px(style.h),
    justifyContent: 'center',

    '@media (max-width: 767px)': {
      padding: px(10),
    },

    '> div': {
      minWidth: px(style.h),
      textAlign: 'center',
    },

    button: {
      alignItems: 'center',
      color: style.c,
      display: 'inline-flex',
      fontSize: px(16),
      height: px(48),
      justifyContent: 'center',
      width: px(48),

      '&.rswp__toggle': {
        fontSize: px(28),
      },
    },
  }),
  'ControlsRSWP',
);

export default function Controls(props: Props) {
  const {
    isExternalDevice,
    isPlaying,
    locale,
    nextTracks,
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    previousTracks,
    styles: { color, height },
  } = props;

  return (
    <div className={styles.buttonControls}>
      <div className={styles.control}>
        <IconButton
          aria-label={isPlaying ? locale.pause : locale.play}
          className="playback__toggle"
          onClick={onClickTogglePlay}
          title={isPlaying ? locale.pause : locale.play}
          type="button"
          id={idConstants.playToggle}
        >
          {isPlaying ? <PauseOutlined /> : <PlayArrow />}
        </IconButton>
      </div>
      <div className={styles.control}>
        {(!!nextTracks.length || isExternalDevice) && (
          <IconButton
            aria-label={locale.next}
            onClick={onClickNext}
            title={locale.next}
            type="button"
            id={idConstants.nextToggle}
          >
            <SkipNext />
          </IconButton>
        )}
      </div>
    </div>
  );
}
