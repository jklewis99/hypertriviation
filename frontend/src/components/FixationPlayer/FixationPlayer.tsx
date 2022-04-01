import React, { useState } from 'react';
import { PlayerFixationProps } from '../../interfaces/props/PlayerFixation.props';
import FixationPlayerJoin from '../FixationPlayerJoin/FixationPlayerJoin';
import FixationPlayerQuestion from '../FixationPlayerQuestion/FixationPlayerQuestion';
import styles from './FixationPlayer.module.scss';

const FixationPlayer = (props: PlayerFixationProps) => {
  const [inFixationSession, setInFixationSession] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();
  const [isFixationSessionActive, setIsFixationSessionActive] = useState<boolean>(false);

  const setJoined = (displayName: string) => {
    setInFixationSession(true)
    setDisplayName(displayName);
  }

  if (!inFixationSession) {
    return (
      <div className={styles.PlayerFixation} data-testid="PlayerFixation">
        <FixationPlayerJoin webSocket={props.webSocket} setJoinedCallback={setJoined}/>
      </div>
    )
  }
  return (
    <div className={styles.PlayerFixation} data-testid="PlayerFixation">
      <div className={styles.displayName}>
        {displayName}
      </div>
      {
        isFixationSessionActive
        ?
        <div className={styles.mainContent}>
          Waiting for host to start fixation...
        </div>
        :
        <FixationPlayerQuestion displayName={displayName || ''} questionId={18} questionTxt={"the hair of what famous....."} webSocket={props.webSocket}/>
      }
    </div>
  )
  
}

export default FixationPlayer;
