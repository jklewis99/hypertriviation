import React, { FC } from 'react';
import styles from './FixationSessionEnd.module.scss';

interface FixationSessionEndProps {}

const FixationSessionEnd: FC<FixationSessionEndProps> = () => {
  return (
    <div className={styles.FixationSessionEnd} data-testid="FixationSessionEnd">
      This is the end of the session.

      TODO: Show standings.
      TODO: Get stats.
    </div>
  );
}

export default FixationSessionEnd;
