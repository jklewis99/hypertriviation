import React, { useEffect, useRef, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { SocketEventReceived,
  SessionQuestionChangedEventPayload,
  QuestionAnsweredSendEventPayload,
  SessionStartedEventPayload,
  SessionQuestionChangedEvent,
  SessionQuestionRevealAnswersEventPayload, 
  SessionSongChangedEventPayload} from '../../interfaces/websockets/SocketEvents';
import { socketEventNames } from '../../websockets/websockets';
import FixationPlayerJoin from '../FixationPlayerJoin/FixationPlayerJoin';
import FixationPlayerQuestion from '../FixationPlayerQuestion/FixationPlayerQuestion';
import styles from './FixationPlayer.module.scss';

interface QuestionForPlayer {
  questionId: number;
  questionTxt: string;
}
interface SongForPlayer {
  songName: string;
  artistName: string;
}

interface PlayerFixationProps {}

const FixationPlayer = (props: PlayerFixationProps) => {
  const [inFixationSession, setInFixationSession] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();
  const [roomCode, setRoomCode] = useState<string>();
  const [isFixationSessionActive, setIsFixationSessionActive] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForPlayer>();
  const [currentSong, setCurrentSong] = useState<SongForPlayer>();
  const [currentAnswers, setCurrentAnswers] = useState<FixationAnswer[]>([]);
  const [multipleChoiceInd, setMultipleChoiceInd] = useState<boolean>(false);
  const [revealAnswersInd, setRevealAnswersInd] = useState<boolean>(false);
  const [webSocket, setWebSocket] = useState<WebSocket>();
  
  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        let event_json = JSON.parse(event.data);
        handleSocketEvent(event_json);
      }
    }
  }, [webSocket]);

  const handleSocketEvent = (socketMessage: SocketEventReceived) => {
    console.log(socketMessage.data);
    if (socketMessage.success && socketMessage.code === roomCode) {
      let payload = socketMessage.data;
      switch (socketMessage.event) {
        case (socketEventNames.SESSION_STARTED): {
          payload = payload as SessionStartedEventPayload;
          setIsFixationSessionActive(payload.session_started);
          setMultipleChoiceInd(payload.multiple_choice_ind);
          break;
        }
        case (socketEventNames.SESSION_QUESTION_CHANGE): {
          payload = payload as SessionQuestionChangedEventPayload;
          setCurrentQuestion({
            questionId: payload.question_idx,
            questionTxt: payload.question_txt
          });
          setCurrentAnswers(payload.answers);
          setRevealAnswersInd(false);
          break;
        }
        case (socketEventNames.SESSION_SONG_CHANGE): {
          payload = payload as SessionSongChangedEventPayload;
          setCurrentSong({
            songName: payload.song_name,
            artistName: payload.artist_name
          });
          setRevealAnswersInd(false);
          break;    
        }
        case (socketEventNames.SESSION_QUESTION_REVEAL_ANSWER): {
          payload = payload as SessionQuestionRevealAnswersEventPayload;
          setRevealAnswersInd(payload.do_reveal);
          break;
        }
        default: {
          // TODO: handle users joining and set usernames to list so we know what usernames are taken
          debugger;
        }
      }
    }
  }

  const setJoined = (newWebSocket: WebSocket, displayName: string, roomCode: string) => {
    setWebSocket(newWebSocket);
    setInFixationSession(true)
    setDisplayName(displayName);
    setRoomCode(roomCode);
  }


  if (!inFixationSession) {
    return (
      <div className={styles.PlayerFixation} data-testid="PlayerFixation">
        <FixationPlayerJoin setJoinedCallback={setJoined}/>
      </div>
    )
  }
  return (
    <div className={styles.PlayerFixation} data-testid="PlayerFixation">
      <div className={styles.displayName}>
        {displayName}
      </div>
      {
        isFixationSessionActive && webSocket
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
            multipleChoiceInd={multipleChoiceInd}
            revealAnswersInd={revealAnswersInd}
            webSocket={webSocket}
          />
          :
          (
            currentSong && roomCode && displayName
            ?
            <div className={styles.mainContent} style={{flexDirection: "column"}}>
              {/* TODO make this something interesting */}
              <i>{currentSong.songName}</i> by <b>{currentSong.artistName}</b>
            </div>
            :
            <div className={styles.mainContent}>
              Get ready...
            </div>
          )
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
