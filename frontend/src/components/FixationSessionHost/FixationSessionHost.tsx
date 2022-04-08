import React, { useEffect, useRef, useState } from 'react';
import styles from './FixationSessionHost.module.scss';
import { useLocation } from 'react-router-dom';
import { FixationSession } from '../../interfaces/FixationSession';
import FixationSessionStart from '../FixationSessionStart/FixationSessionStart';
import { getFixation, getFixationPlayers, getFixationQuestion, getFixationQuestionAnswers, getFixationQuestionsAndAnswers } from '../../services/fixation.service';
import { FixationSessionPlayer } from '../../interfaces/FixationSessionPlayer';
import { JoinSessionReceivedEventPayload, SessionOpenedEvent, SessionQuestionChangedEvent, SessionQuestionRevealAnswersEvent, SessionSongChangedEvent, SessionStartedEvent, SocketEventReceived } from '../../interfaces/websockets/SocketEvents';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import FixationSessionInstructions from '../FixationSessionInstructions/FixationSessionInstructions';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import { Fixation } from '../../interfaces/Fixation';
import FixationSessionQuestion from '../FixationSessionQuestion/FixationSessionQuestion';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationSessionSettings } from '../../interfaces/FixationSessionSettings';
import { getRandomInt, knuthShuffle } from '../../utils/randomFunctions';
import { FixationQuestionAndAnswers } from '../../interfaces/FixationQuestionsAndAnswers';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import FixationSessionAnswer from '../FixationSessionAnswer/FixationSessionAnswer';
import FixationSessionEnd from '../FixationSessionEnd/FixationSessionEnd';
import { socketEventNames } from '../../interfaces/websockets/socketUtils';
import { HypertriviationUser } from '../../interfaces/HypertriviationUser';

interface FixationSessionHostProps {
  webSocket: WebSocket;
  isSpotifyAuthenticated: boolean;
  hostUser: HypertriviationUser;
}

const FixationSessionHost = (props: FixationSessionHostProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWaitingToStart, setIsWaitingToStart] = useState<boolean>(true);
  const [doShowInstructions, setDoShowInstructions] = useState<boolean>(false);
  const [isSessionLive, setIsSessionLive] = useState<boolean>(false);
  const [joinedUsers, setJoinedUsers] = useState<FixationSessionPlayer[]>([]);
  const [playlistId, setPlaylistId] = useState<string>();
  const [currentFixation, setCurrentFixation] = useState<Fixation>();
  const [currentFixationQuestions, setCurrentFixationQuestions] = useState<FixationQuestion[]>();
  const [currentFixationQuestionsAndAnswers, setCurrentFixationQuestionsAndAnswers] = useState<FixationQuestionAndAnswers[]>();
  const [currentFixationAnswers, setCurrentFixationAnswers] = useState<FixationAnswer[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [isEndOfFixation, setIsEndOfFixation] = useState<boolean>(false);
  const fixationSession: FixationSession = useLocation().state.session;
  const fixationSessionSettings: FixationSessionSettings = useLocation().state.sessionSettings;
  const webSocket = useRef<WebSocket>(props.webSocket).current;

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
    webSocket.onmessage = (event) => {
      handleUserJoined(JSON.parse(event.data))
    }
  });

  const handleAllUsersJoined = () => {
    setIsWaitingToStart(false);
    setDoShowInstructions(true);
    sendSessionStartedEvent();
  }

  const handleSessionIsLive = () => {
    // TODO: make users unable to join
    setDoShowInstructions(false);
    setIsSessionLive(true);
    if (currentFixation && !currentFixation.spotifyPlaylistId) {
      setAnswersAndSendSocketEvent(currentQuestionIdx);
    }
    console.log("Session is live");
  }

  const handleUserJoined = (socketMessage: SocketEventReceived) => {
    console.log(socketMessage.data)
    if (socketMessage.success) {
      let payload = socketMessage.data;
      if (socketMessage.event === socketEventNames.SESSION_JOIN) {
        payload = payload as JoinSessionReceivedEventPayload;
        let player: FixationSessionPlayer = {
          fixationSession: payload.fixation_session,
          playerSessionId: payload.player_session_id,
          displayName: payload.display_name
        }
        setJoinedUsers([...joinedUsers, player]);
      }
      else {
        // TODO: handle more socket events
        return;
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

  const incrementCurrentQuestionIdx = (change: number) => {
    if (change > 0 && currentFixationQuestionsAndAnswers && currentQuestionIdx === currentFixationQuestionsAndAnswers.length - 1) {
      setIsEndOfFixation(true);
      return;
    }
    revealAnswer(false);
    let questionIdx = currentQuestionIdx + change;
    setAnswersAndSendSocketEvent(questionIdx);
    setCurrentQuestionIdx(questionIdx);
  }

  const setAnswersAndSendSocketEvent = (questionIdx: number) => {
    if (currentFixationQuestionsAndAnswers) {
      let answers = knuthShuffle(currentFixationQuestionsAndAnswers[questionIdx].answers)
      setCurrentFixationAnswers(answers);
      sendSessionQuestionChangeEvent(questionIdx, currentFixationQuestionsAndAnswers[questionIdx].question, answers )
    }
  }

  const terminateQuestion = (answerSubmitted: boolean = false) => {
    if (answerSubmitted) {
      // TODO handle some logic when socket stuff happens
      return;
    }
    if (currentFixationQuestionsAndAnswers) {
      sendSessionQuestionRevealAnswersEvent(currentQuestionIdx, currentFixationQuestionsAndAnswers[currentQuestionIdx].question);
    }
    revealAnswer(true); // todo: handle boolean with settings
  }

  const changeSong = (songName: string, artistName: string) => {
    sendSessionSongChangeEvent(songName, artistName);
  }

  const revealAnswer = (doShow: boolean) => {
    setShowAnswers(doShow);
  }

  const getPlaylistOffset = (numberOfSongs: number) => {
    return getRandomInt(0, numberOfSongs);
  }
  
  const getSongPercentageDurationOffset = (min: number = 0, max: number = 60) => {
    return getRandomInt(min, max);
  }

  const sendSessionStartedEvent = () => {
    let message: SessionStartedEvent = {
      group: fixationSession.code,
      model: "session_started",
      payload: {
        fixation_id: fixationSession.fixationId,
        room_code: fixationSession.code,
        session_started: true,
        multiple_choice_ind: fixationSessionSettings.multipleChoiceInd
      }
    };
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
  }

  const sendSessionQuestionChangeEvent = (idx: number, question: FixationQuestion, answers: FixationAnswer[]) => {
    let message: SessionQuestionChangedEvent = {
      group: fixationSession.code,
      model: "session_question_change",
      payload: {
        fixation_id: fixationSession.fixationId,
        room_code: fixationSession.code,
        question_txt: question.questionTxt,
        question_idx: idx,
        answers: answers
      }
    };
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
  }

  const sendSessionSongChangeEvent = (songName: string, artistName: string) => {
    let message: SessionSongChangedEvent = {
      group: fixationSession.code,
      model: "session_song_change",
      payload: {
        fixation_id: fixationSession.fixationId,
        room_code: fixationSession.code,
        song_name: songName,
        artist_name: artistName
      }
    };
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
  }

  const sendSessionQuestionRevealAnswersEvent = (idx: number, question: FixationQuestion) => {
    let message: SessionQuestionRevealAnswersEvent = {
      group: fixationSession.code,
      model: "session_question_reveal_answer",
      payload: {
        fixation_id: fixationSession.fixationId,
        room_code: fixationSession.code,
        question_txt: question.questionTxt,
        question_idx: idx,
        do_reveal: true // change to a setting
      }
    };
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
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
        <FixationSessionEnd/>
      </div>
    )
  }

  if (playlistId != "") {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        <MusicPlayer
          spotifyUri={`spotify:playlist:${playlistId}`}
          songOffset={currentFixation?.spotifyRandomStartInd ? getSongPercentageDurationOffset() : 0}
          playlistOffset={currentFixation?.keepShuffled ? getPlaylistOffset(currentFixation.questionCount) : 0}
          goToNextSong={changeSong}
        />
      </div>
    );
  }

  if (currentFixation && !currentFixation.spotifyPlaylistId && currentFixationQuestionsAndAnswers) {
    return (
      <div className={styles.FixationSessionHost} data-testid="FixationSessionHost">
        {
          !showAnswers
          ?
          <CountdownTimer
            key={currentQuestionIdx}
            secondsRemaining={fixationSessionSettings.timeLimit}
            stopTimerCallback={terminateQuestion}
          />
          :
          "0 sec"
        }
        <FixationSessionQuestion
          question={currentFixationQuestionsAndAnswers[currentQuestionIdx].question}
          questionIdx={currentQuestionIdx + 1}
          answers={currentFixationQuestionsAndAnswers[currentQuestionIdx].answers}
          hasPrevious={currentQuestionIdx > 0}
          goToNextQuestionCallback={incrementCurrentQuestionIdx}
        />
        <FixationSessionAnswer
          answers={currentFixationAnswers}
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
