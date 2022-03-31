import React, { useState } from 'react';
import { PlayerFixationProps } from '../../interfaces/props/PlayerFixation.props';
import PlayerFixationJoin from '../PlayerFixationJoin/PlayerFixationJoin';
import styles from './PlayerFixation.module.scss';

const PlayerFixation = (props: PlayerFixationProps) => {
  const [inFixationSession, setInFixationSession] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();

  const setJoined = (displayName: string) => {
    setInFixationSession(true)
    setDisplayName(displayName);
  }

  if (!inFixationSession) {
    return (
      <div className={styles.PlayerFixation} data-testid="PlayerFixation">
        <PlayerFixationJoin webSocket={props.webSocket} setJoinedCallback={setJoined}/>
      </div>
    )
  }
  return (
    <div className={styles.PlayerFixation} data-testid="PlayerFixation">
      <div className={styles.displayName}>
        {displayName}
      </div>
      <div className={styles.mainContent}>
        Waiting for host to start fixation...
      </div>
    </div>
  )
  
}

export default PlayerFixation;
