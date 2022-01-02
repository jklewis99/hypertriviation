import * as React from 'react';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { Slider, Stack } from '@mui/material';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

interface Props {
  playerPosition: string;
  setVolume: (volume: number) => any;
  title: string;
  volume: number;
}

interface State {
  isOpen: boolean;
  volume: number;
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
      display: 'flex',
      flexDirection: 'column',
      padding: px(12),
      position: 'absolute',
      right: `-${px(3)}`,
    },

    '> button': {
      fontSize: px(26),
    },

    '@media (max-width: 1023px)': {
      display: 'none',
    },
  },
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },
    '> div': {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : 'none',
      [style.p]: '120%',
    },
  }),
  'VolumeRSWP',
);

export default class Volume extends React.PureComponent<Props, State> {
  private timeout: number | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      volume: props.volume,
    };
  }

  public componentDidUpdate(previousProps: Props) {
    const { volume: volumeState } = this.state;
    const { volume } = this.props;

    if (previousProps.volume !== volume && volume !== volumeState) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ volume });
    }
  }

  private handleClick = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  private handleChangeSlider = (event: Event, newValue: number | number[], activeThumb: number) => {
    const { setVolume } = this.props;
    // debugger;
    // const volume = newValue as number;
    const volume = Math.round(newValue as number) / 100;

    clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => {
      setVolume(volume);
    }, 50);

    this.setState({ volume });
  };

  private handleAfterEnd = () => {
    setTimeout(() => {
      this.setState({ isOpen: false });
    }, 100);
  };

  public render() {
    const { isOpen, volume } = this.state;
    const {
      playerPosition,
      title,
    } = this.props;

    return (
      // <Wrapper style={{ altColor, bgColor, c: color, p: playerPosition }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" style={{ width: '100%'}}>
        <VolumeDown />
        <Slider aria-label="Volume" value={volume * 100} onChange={this.handleChangeSlider} />
        <VolumeUp />
      </Stack>
    );
  }
}
