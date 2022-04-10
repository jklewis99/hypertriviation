import { display } from '@mui/system';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { QuestionAnsweredEvent } from '../../interfaces/websockets/SocketEvents';
import { getFixationQuestionAnswers } from '../../services/fixation.service';
import { sendQuestionAnsweredEvent } from '../../websockets/websockets';
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
  const webSocket = useRef<WebSocket>(props.webSocket).current;

  const submitAnswer = (answerTxt: string, answerId?: number) => {
    // TODO: update to SubmitAnswer event type
    sendQuestionAnsweredEvent(webSocket, props.displayName, props.roomCode, props.questionId, answerTxt, answerId);
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
