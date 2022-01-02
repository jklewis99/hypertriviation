import React, { useEffect } from 'react';
import styles from './FixationStart.module.scss';
import { useInterval } from '../../hooks/useInterval';
import { getAllFixations } from '../../services/fixation.service';

const FixationStart = () => {
  // TODO: use pulling to get list of joined users every 3 seconds

  // TODO: show random user avatar


  // Get the current room
  useEffect(() => {
    getAllFixations().then(
      data => {
        // debugger;
        // if (mounted)
          // setFixations(data);
      }
    ).catch(
      error => {
        // if (mounted)
          // setErrorMessage(error);
      }
    ).finally(
      () => {
        // if (mounted)
          // setIsLoading(false)
      }
    );
  }, []);

  useInterval(() => {
    // get added users.
    console.log("useINterval called")
  }, 2000);

  return (
    <div className={styles.FixationStart} data-testid="FixationStart">
      FixationStart Component
    </div>
  );
}

export default FixationStart;
