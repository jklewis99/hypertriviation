import React, { useEffect, useRef, useState } from 'react';
import styles from './FixationSessionHost.module.scss';
import { useLocation } from 'react-router-dom';
import { FixationSession } from '../../interfaces/FixationSession';
import FixationSessionStart from '../FixationSessionStart/FixationSessionStart';
import { FixationSessionHostProps } from '../../interfaces/props/FixationSessionHost.props';
import { getFixation, getFixationPlayers, getFixationQuestion, getFixationQuestionAnswers, getFixationQuestionsAndAnswers } from '../../services/fixation.service';
import { FixationSessionPlayer } from '../../interfaces/FixationSessionPlayer';
import { JoinRoomReceivedEventPayload, SocketEventReceived } from '../../interfaces/websockets/SocketEvents';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import FixationSessionInstructions from '../FixationSessionInstructions/FixationSessionInstructions';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import { Fixation } from '../../interfaces/Fixation';

const FixationSessionHost = (props: FixationSessionHostProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWaitingToStart, setIsWaitingToStart] = useState<boolean>(true);
  const [doShowInstructions, setDoShowInstructions] = useState<boolean>(false);
  const [isSessionLive, setIsSessionLive] = useState<boolean>(false);
  const fixationSession: FixationSession = useLocation().state;
  const webSocket = useRef<WebSocket>(props.webSocket);
  const [joinedUsers, setJoinedUsers] = useState<FixationSessionPlayer[]>([]);
  const [playlistId, setPlaylistId] = useState<string>();
  const [currentFixation, setCurrentFixation] = useState<Fixation>();
  const [pageNumber, setPageNumber] = useState<number>(1);

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
        setPlaylistId("")
      })
      .catch((error: Error) => setErrorMessage(error.message));
      
    getFixation(fixationSession.fixationId)
      .then((response) => {
        console.log(response);
        setCurrentFixation(response);
        setPlaylistId(response.spotifyPlaylistId);
      })
      .catch((error: Error) => setErrorMessage(error.message));

    getFixationQuestion(1)
      .then((response) => {
        console.log(response);
      })
      .catch((error: Error) => console.log(error));

    getFixationQuestionAnswers(1)
      .then((response) => {
        console.log(response);
      })
      .catch((error: Error) => console.log(error));
  }, []);

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      handleUserJoined(JSON.parse(event.data))
    }
  });

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

  const getQuestionAndAnswers = (fixationId: number, pageNumber: number) => {
    getFixationQuestionsAndAnswers(fixationId, pageNumber)
      .then((response) => {
        console.log(response);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
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
  if (playlistId != "") {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        {`spotify:playlist:${playlistId}`}
        <MusicPlayer spotifyUri={`spotify:playlist:${playlistId}`}/>
      </div>
    );
  }
  if (currentFixation && !currentFixation.spotifyPlaylistId) {
    // show the thing
    getQuestionAndAnswers(currentFixation.id, pageNumber);
  }
  return (
    <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
      Session is starting...
    </div>
  );
}

export default FixationSessionHost;
