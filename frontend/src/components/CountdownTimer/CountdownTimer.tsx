import { Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import styles from './CountdownTimer.module.scss';

interface CountdownTimerProps {
  secondsRemaining: number;
  stopTimerCallback: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = (props) => {

  const [secondsRemaining, setSecondsRemaining] = useState<number>(props.secondsRemaining);

  const updateTimeRemaining = () => {
    if (secondsRemaining - 1 <= 0) {
      setSecondsRemaining(0);
      props.stopTimerCallback();
      return;
    }
    setSecondsRemaining(secondsRemaining - 1);
  }

  useInterval(updateTimeRemaining, 1000);

  return (
    <div className={styles.CountdownTimer} data-testid="CountdownTimer">
      <Typography>
        {secondsRemaining} sec
      </Typography>
    </div>
  );
}

export default CountdownTimer;
