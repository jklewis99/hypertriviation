import React, { useEffect, useRef, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { PlayerFixationProps } from '../../interfaces/props/PlayerFixation.props';
import { SocketEventReceived, SessionQuestionChangedEventPayload, QuestionAnsweredSendEventPayload, SessionStartedEventPayload } from '../../interfaces/websockets/SocketEvents';
import { isSessionQuestionChangedEventPayload, isSessionStartedEventPayload } from '../../interfaces/websockets/socketUtils';
import FixationPlayerJoin from '../FixationPlayerJoin/FixationPlayerJoin';
import FixationPlayerQuestion from '../FixationPlayerQuestion/FixationPlayerQuestion';
import styles from './FixationPlayer.module.scss';

interface QuestionForPlayer {
  questionId: number;
  questionTxt: string;
}

const FixationPlayer = (props: PlayerFixationProps) => {
  const [inFixationSession, setInFixationSession] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();
  const [roomCode, setRoomCode] = useState<string>();
  const [isFixationSessionActive, setIsFixationSessionActive] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForPlayer>();
  const [currentAnswers, setCurrentAnswers] = useState<FixationAnswer[]>([]);
  const webSocket = useRef<WebSocket>(props.webSocket).current;
  
  useEffect(() => {
    webSocket.onmessage = (event) => {
      let event_json = JSON.parse(event.data);
      handleSocketEvent(event_json);
    }
  });

  const handleSocketEvent = (socketMessage: SocketEventReceived) => {
    console.log(socketMessage.data)
    if (socketMessage.success) {
      let payload = socketMessage.data;
      if (isSessionStartedEventPayload(payload)) {
        setIsFixationSessionActive(payload.session_started);
      }
      else if (isSessionQuestionChangedEventPayload(payload)) {
        setCurrentQuestion({
          questionId: payload.question_idx,
          questionTxt: payload.question_txt
        });
        setCurrentAnswers(payload.answers);
      }
      else {
        // TODO: handle users joining and set usernames to list so we know what usernames are taken
        debugger;
      }
    }
  }

  const setJoined = (displayName: string, roomCode: string) => {
    setInFixationSession(true)
    setDisplayName(displayName);
    setRoomCode(roomCode);
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
        (
          currentQuestion && currentAnswers && roomCode && displayName
          ?
          <FixationPlayerQuestion
            displayName={displayName}
            roomCode={roomCode}
            questionId={currentQuestion.questionId}
            questionTxt={currentQuestion.questionTxt}
            answers={currentAnswers}
            webSocket={webSocket}
          />
          :
          <div className={styles.mainContent}>
            Get ready...
          </div>
        )
        :
        <div className={styles.mainContent}>
          Waiting for host to start fixation...
        </div>        
      }
    </div>
  )
  
}

export default FixationPlayer;
