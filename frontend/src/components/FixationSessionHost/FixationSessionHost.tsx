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
import FixationSessionQuestion from '../FixationSessionQuestion/FixationSessionQuestion';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationSessionSettings } from '../../interfaces/FixationSessionSettings';
import { knuthShuffle } from '../../utils/randomFunctions';
import { FixationQuestionAndAnswers } from '../../interfaces/FixationQuestionsAndAnswers';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import FixationSessionAnswer from '../FixationSessionAnswer/FixationSessionAnswer';

const FixationSessionHost = (props: FixationSessionHostProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWaitingToStart, setIsWaitingToStart] = useState<boolean>(true);
  const [doShowInstructions, setDoShowInstructions] = useState<boolean>(false);
  const [isSessionLive, setIsSessionLive] = useState<boolean>(false);
  const fixationSession: FixationSession = useLocation().state.session;
  const fixationSessionSettings: FixationSessionSettings = useLocation().state.sessionSettings;
  const webSocket = useRef<WebSocket>(props.webSocket);
  const [joinedUsers, setJoinedUsers] = useState<FixationSessionPlayer[]>([]);
  const [playlistId, setPlaylistId] = useState<string>();
  const [currentFixation, setCurrentFixation] = useState<Fixation>();
  const [currentFixationQuestions, setCurrentFixationQuestions] = useState<FixationQuestion[]>();
  const [currentFixationQuestionsAndAnswers, setCurrentFixationQuestionsAndAnswers] = useState<FixationQuestionAndAnswers[]>();
  const [currentFixationAnswers, setCurrentFixationAnswers] = useState<FixationAnswer[]>();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [isEndOfFixation, setIsEndOfFixation] = useState<boolean>(false);

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
      .catch((error: Error) => setErrorMessage(error.message));
      
    getFixation(fixationSession.fixationId)
      .then((response) => {
        console.log(response);
        setCurrentFixation(response);
        setPlaylistId(response.spotifyPlaylistId);
        getQuestionAndAnswers(response.id, 0);
      })
      .catch((error: Error) => setErrorMessage(error.message));
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
        setCurrentFixationQuestionsAndAnswers(fixationSessionSettings.randomShuffleInd ? knuthShuffle(response) : response);
        console.log(response);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }

  const getCurrentQuestionAnswers = (questionId: number) => {
    return currentFixationAnswers?.filter((answer: FixationAnswer) => answer.questionId === questionId) || [];
  }

  const incrementCurrentQuestionIdx = () => {
    if (currentFixationQuestionsAndAnswers && currentQuestionIdx === currentFixationQuestionsAndAnswers.length - 1) {
      setIsEndOfFixation(true);
      return;
    }
    revealAnswer(false);
    setCurrentQuestionIdx(currentQuestionIdx + 1);
  }

  const terminateQuestion = (answerSubmitted: boolean = false) => {
    if (answerSubmitted) {
      // TODO handle some logic when socket stuff happens
      return;
    }
    revealAnswer(true);
  }

  const revealAnswer = (doShow: boolean) => {
    setShowAnswers(doShow);
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
  
  if (isEndOfFixation) {
    // TODO: mark FixationSession as deleted
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        This is the end of the session.

        TODO: Show standings.
        TODO: Get stats.
      </div>
    )
  }

  if (playlistId != "") {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        {`spotify:playlist:${playlistId}`}
        <MusicPlayer spotifyUri={`spotify:playlist:${playlistId}`}/>
      </div>
    );
  }

  if (currentFixation && !currentFixation.spotifyPlaylistId && currentFixationQuestionsAndAnswers) {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        <CountdownTimer key={currentQuestionIdx} secondsRemaining={fixationSessionSettings.timeLimit} stopTimerCallback={terminateQuestion}/>
        <FixationSessionQuestion
          question={currentFixationQuestionsAndAnswers[currentQuestionIdx].question}
          questionIdx={currentQuestionIdx}
          answers={currentFixationQuestionsAndAnswers[currentQuestionIdx].answers}
          goToNextQuestionCallback={incrementCurrentQuestionIdx}
        />
        <FixationSessionAnswer
          answers={currentFixationQuestionsAndAnswers[currentQuestionIdx].answers}
          revealAnswers={showAnswers}
          isMultipleChoice={fixationSessionSettings.multipleChoiceInd}
        />
      </div>
    )
  }
  return (
    <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
      Session is starting...
    </div>
  );
}

export default FixationSessionHost;
