import { display } from '@mui/system';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { QuestionAnsweredEvent } from '../../interfaces/websockets/SocketEvents';
import { getFixationQuestionAnswers } from '../../services/fixation.service';
import FixationSessionAnswer from '../FixationSessionAnswer/FixationSessionAnswer';
import styles from './FixationPlayerQuestion.module.scss';

interface FixationPlayerQuestionProps {
  displayName: string;
  roomCode: string;
  questionId: number;
  questionTxt: string;
  answers: FixationAnswer[];
  multipleChoiceInd: boolean;
  revealAnswersInd: boolean;
  webSocket: WebSocket;
}

const FixationPlayerQuestion: FC<FixationPlayerQuestionProps> = (props) => {
  const webSocket = useRef<WebSocket>(props.webSocket);

  const submitAnswer = (answerId: number, answerTxt: string) => {
    // TODO: update to SubmitAnswer event type
    console.log(answerId);
    let message: QuestionAnsweredEvent = {
      model: "answer",
      payload: {
        display_name: props.displayName,
        player_session_id: "abcd",
        room_code: props.roomCode,
        question_id: props.questionId,
        answer_id: answerId,
        answer_txt: answerTxt
      }
    };
    webSocket.current.send(JSON.stringify(message));
  }

  return (
    <div className={styles.FixationPlayerQuestion} data-testid="FixationPlayerQuestion">
      {/* TODO: Update Settings */}
      {props.questionTxt}
      <FixationSessionAnswer
        answers={props.answers}
        isMultipleChoice={props.multipleChoiceInd}
        revealAnswers={props.revealAnswersInd}
        isPlayer={true}
        submitAnswerCallback={submitAnswer}
      />
    </div>
  );
}

export default FixationPlayerQuestion;
