import React, { useEffect, useRef, useState } from 'react';
import styles from './FixationSessionHost.module.scss';
import { useLocation } from 'react-router-dom';
import { FixationSession } from '../../interfaces/FixationSession';
import FixationSessionStart from '../FixationSessionStart/FixationSessionStart';
import { getFixation, getFixationPlayers, getFixationQuestion, getFixationQuestionAnswers, getFixationQuestionsAndAnswers } from '../../services/fixation.service';
import { FixationSessionPlayer } from '../../interfaces/FixationSessionPlayer';
import { JoinSessionReceivedEventPayload, QuestionAnsweredEvent, QuestionAnsweredSendEventPayload, SessionOpenedEvent, SessionQuestionChangedEvent, SessionQuestionRevealAnswersEvent, SessionQuestionRevealAnswersEventPayload, SessionSongChangedEvent, SessionStartedEvent, SocketEventReceived } from '../../interfaces/websockets/SocketEvents';
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
import { HypertriviationUser } from '../../interfaces/HypertriviationUser';
import { sendSessionQuestionChangeEvent, sendSessionQuestionRevealAnswersEvent, sendSessionSongChangeEvent, sendSessionStartedEvent, socketEventNames } from '../../websockets/websockets';
import FixationSessionPlayersList from '../FixationSessionPlayersList/FixationSessionPlayersList';
import FixationSessionAnswerPopup from '../FixationSessionAnswerPopup/FixationSessionAnswerPopup';
import { SubmittedAnswer } from '../../interfaces/SubmittedAnswer';

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
  const [latestUserToAnswer, setLatestUserToAnswer] = useState<string>();
  const [correctPlaylistAnswer, setCorrectPlaylistAnswer] = useState<any>();
  const [submittedAnswer, setSubmittedAnswer] = useState<SubmittedAnswer>();
  const [showAnswerPopup, setShowAnswerPopup] = useState<boolean>(false);
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
      handleSocketEvent(JSON.parse(event.data))
    }
  });

  const handleAllUsersJoined = () => {
    setIsWaitingToStart(false);
    setDoShowInstructions(true);
    sendSessionStartedEvent(webSocket, fixationSession.code, fixationSession.fixationId, fixationSessionSettings.multipleChoiceInd);
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

  const goToNextQuestion = (change: number) => {
    if (change > 0 && currentFixationQuestionsAndAnswers && currentQuestionIdx === currentFixationQuestionsAndAnswers.length - 1) {
      setIsEndOfFixation(true);
      return;
    }
    revealAnswer(false);
    setLatestUserToAnswer(undefined);
    let questionIdx = currentQuestionIdx + change;
    setAnswersAndSendSocketEvent(questionIdx);
    setCurrentQuestionIdx(questionIdx);
    setSubmittedAnswer(undefined);
  }

  const setAnswersAndSendSocketEvent = (questionIdx: number) => {
    if (currentFixationQuestionsAndAnswers) {
      let answers = knuthShuffle(currentFixationQuestionsAndAnswers[questionIdx].answers)
      setCurrentFixationAnswers(answers);
      sendSessionQuestionChangeEvent(webSocket, questionIdx, fixationSession.code, fixationSession.fixationId,
        currentFixationQuestionsAndAnswers[questionIdx].question.questionTxt, answers);
    }
  }

  const terminateQuestion = (answerSubmitted: boolean = false) => {
    if (answerSubmitted) {
      // TODO handle some logic when socket stuff happens
      return;
    }
    if (currentFixationQuestionsAndAnswers) {
      sendSessionQuestionRevealAnswersEvent(
        webSocket,
        currentQuestionIdx,
        fixationSession.code,
        fixationSession.fixationId,
        currentFixationQuestionsAndAnswers[currentQuestionIdx].question.questionTxt
      );
    }
    revealAnswer(true); // todo: handle boolean with settings
  }

  const changeSong = (songName: string, artistName: string) => {
    setLatestUserToAnswer(undefined);
    setSubmittedAnswer(undefined);
    setCorrectPlaylistAnswer({
      song: songName,
      artist: artistName,
      album: "" //TODO
    })
    sendSessionSongChangeEvent(webSocket, fixationSession.code, fixationSession.fixationId, songName, artistName);
  }

  const revealAnswer = (doShow: boolean) => {
    setShowAnswers(doShow);
  }

  const closeModalCallback = (goToNextQuestionInd: boolean = false) => {
    setShowAnswerPopup(false);
    if (goToNextQuestionInd) {
      if (currentFixation?.spotifyPlaylistId) {
        // TODO skip from the host
      }
      else {
        goToNextQuestion(1);
      }
    }
  }

  const getPlaylistOffset = (numberOfSongs: number) => {
    return getRandomInt(0, numberOfSongs);
  }
  
  const getSongPercentageDurationOffset = (min: number = 0, max: number = 60) => {
    return getRandomInt(min, max);
  }

  const handleSocketEvent = (socketMessage: SocketEventReceived) => {
    console.log(socketMessage.data);
    if (socketMessage.success && socketMessage.code === fixationSession.code) {
      let payload = socketMessage.data;
      switch (socketMessage.event) {
        case (socketEventNames.SESSION_JOIN): {
          payload = payload as JoinSessionReceivedEventPayload;
          handleUserJoined(payload);
          break;
        }
        case (socketEventNames.QUESTION_ANSWERED): {
          // debugger;
          payload = payload as QuestionAnsweredSendEventPayload;
          handleUserAnswered(payload);
          break;
        }
        default: {
          // TODO: handle more socket events
          // TODO: handle users joining and set usernames to list so we know what usernames are taken
          // debugger;
          return;
        }
      }
    }
    else {
      setErrorMessage(socketMessage.message)
    }
  }

  const handleUserAnswered = (payload: QuestionAnsweredSendEventPayload) => {
    debugger;
    setLatestUserToAnswer(payload.display_name);
    if (fixationSessionSettings.stopOnAnswerInd && !submittedAnswer) {
      console.log(payload);
      createAndSetSubmittedAnswer(payload.display_name, payload.answer_txt);
      setShowAnswerPopup(true);
      revealAnswer(true);
    }
  }

  const handleUserJoined = (payload: JoinSessionReceivedEventPayload) => {
    let player: FixationSessionPlayer = {
      fixationSession: payload.fixation_session,
      playerSessionId: payload.player_session_id,
      displayName: payload.display_name
    }
    setJoinedUsers([...joinedUsers, player]);
  }

  const createAndSetSubmittedAnswer = (playerUsername: string, answerTxt: string) => {
    let correctAnswers = currentFixationAnswers.filter((answer) => answer.correctAnswerInd);
    let idx = currentFixationAnswers.findIndex(answer => answer.answerTxt === answerTxt);
    setSubmittedAnswer({
      playerUsername: playerUsername,
      submittedAnswerTxt: answerTxt,
      isCorrectAnswer: correctAnswers.some((answer) => answer.answerTxt === answerTxt && answer.correctAnswerInd),
      answerIdx: idx > -1 ? idx : undefined
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
        {
          // TODO: handle submitted answer for playlist
          showAnswerPopup && submittedAnswer
          ?
          <FixationSessionAnswerPopup
            submittedAnswer={submittedAnswer}
            answers={currentFixationAnswers}
            closeModalCallback={closeModalCallback}
          />
          :
          null
        }
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
          hasPrevious={currentQuestionIdx > 0}
          goToNextQuestionCallback={goToNextQuestion}
        />
        <FixationSessionAnswer
          answers={currentFixationAnswers}
          revealAnswers={showAnswers}
          isMultipleChoice={fixationSessionSettings.multipleChoiceInd}
        />
        <FixationSessionPlayersList players={joinedUsers} lastAnsweredUser={latestUserToAnswer}/>
        {
          showAnswerPopup && submittedAnswer
          ?
          <div className="pop-up-module" >
            <FixationSessionAnswerPopup
              submittedAnswer={submittedAnswer}
              answers={currentFixationAnswers}
              closeModalCallback={closeModalCallback}
            />
          </div>
          :
          null
        }
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
