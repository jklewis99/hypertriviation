import React, { useEffect, useRef, useState } from 'react';
import styles from './FixationSessionHost.module.scss';
import { useLocation } from 'react-router-dom';
import { FixationSession } from '../../interfaces/FixationSession';
import FixationSessionStart from '../FixationSessionStart/FixationSessionStart';
import { FixationSessionHostProps } from '../../interfaces/props/FixationSessionHost.props';
import { getFixationPlayers } from '../../services/fixation.service';
import { FixationSessionPlayer } from '../../interfaces/FixationSessionPlayer';
import { JoinRoomReceivedEventPayload, SocketEventReceived } from '../../interfaces/websockets/SocketEvents';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import FixationSessionInstructions from '../FixationSessionInstructions/FixationSessionInstructions';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

const FixationSessionHost = (props: FixationSessionHostProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWaitingToStart, setIsWaitingToStart] = useState<boolean>(true);
  const [doShowInstructions, setDoShowInstructions] = useState<boolean>(false);
  const [isSessionLive, setIsSessionLive] = useState<boolean>(false);
  const fixationSession: FixationSession = useLocation().state;
  const webSocket = useRef<WebSocket>(props.webSocket);
  const [joinedUsers, setJoinedUsers] = useState<FixationSessionPlayer[]>([]);

  const handleAllUsersJoined = () => {
    setIsWaitingToStart(false);
    setDoShowInstructions(true);
  }
  const handleSessionIsLive = () => {
    // TODO: make users unable to join
    setDoShowInstructions(false);
    setIsSessionLive(true);
    console.log("Session is live");
  }
  useEffect(() => {
    getFixationPlayers(fixationSession.code)
      .then((users) => {
        console.log(users);
        setJoinedUsers([...joinedUsers, ...users])
      })
      .catch((error: Error) => setErrorMessage(error.message))
  }, [])
  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      handleUserJoined(JSON.parse(event.data))
    }
  })

  const handleUserJoined = (socketMessage: SocketEventReceived) => {
    console.log(socketMessage.data)
    if (socketMessage.success) {
      let user = socketMessage.data as JoinRoomReceivedEventPayload;
      if (user !== undefined) {
        let player: FixationSessionPlayer = {
          fixationSession: user.fixation_session,
          playerSessionId: user.player_session_id,
          displayName: user.display_name
        }
        setJoinedUsers([...joinedUsers, player]);
      }
    }
    else {
      setErrorMessage(socketMessage.message)
    }
  }

  if (isWaitingToStart) {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        <div className={styles.playersTop}>
          {
            joinedUsers.filter((_, i) => (i % 4 == 0)).map(user => (
              <Card className={styles.playerCard} key={user.displayName}>
                <CardContent>
                  <Typography noWrap>
                    {user.displayName}
                  </Typography>
                </CardContent>
              </Card>
            ))
          }
        </div>
        <div className={styles.startMiddleContainer}>
          <div className={styles.playersLeft}>
            {
              joinedUsers.filter((_, i) => ((i - 2) % 4 == 0)).map(user => (
                <Card className={styles.playerCard} key={user.displayName}>
                  <CardContent>
                    <Typography noWrap>
                      {user.displayName}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            }
          </div>
          <FixationSessionStart sessionCode={fixationSession.code} startFixationSessionCallback={handleAllUsersJoined} />
          <div className={styles.playersRight}>
            {
              joinedUsers.filter((_, i) => ((i - 3) % 4 == 0)).map(user => (
                <Card className={styles.playerCard} key={user.displayName}>
                  <CardContent>
                    <Typography noWrap>
                      {user.displayName}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
        <div className={styles.playersBottom}>
        {
              joinedUsers.filter((_, i) => ((i - 1) % 4 == 0)).map(user => (
                <Card className={styles.playerCard} key={user.displayName}>
                  <CardContent>
                    <Typography noWrap>
                      {user.displayName}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            }
        </div>
      </div>
    );
  }

  if (doShowInstructions) {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        <FixationSessionInstructions displayFixationQuestionsCallback={handleSessionIsLive}/>
      </div>
    );
  }
  return (
    <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
      Session is starting...
      <MusicPlayer spotifyUri={"spotify:playlist:1lDeSYtMVO3KbOYn1GJvD7"}/>
    </div>
  );
}

export default FixationSessionHost;
