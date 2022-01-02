import React, { useState } from 'react';
import { PlayerFixationProps } from '../../interfaces/props/PlayerFixation.props';
import PlayerFixationJoin from '../PlayerFixationJoin/PlayerFixationJoin';
import styles from './PlayerFixation.module.scss';

const PlayerFixation = (props: PlayerFixationProps) => {
  const [inFixationSession, setInFixationSession] = useState<boolean>(false)

  const setJoined = () => {
    setInFixationSession(true)
  }

  return (<div className={styles.PlayerFixation} data-testid="PlayerFixation">
    {
      !inFixationSession 
      ? <PlayerFixationJoin webSocket={props.webSocket} setJoinedCallback={setJoined}/>
      : null
    }
  </div>
  );
}

export default PlayerFixation;
