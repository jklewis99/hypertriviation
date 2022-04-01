import { display } from '@mui/system';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { getFixationQuestionAnswers } from '../../services/fixation.service';
import FixationSessionAnswer from '../FixationSessionAnswer/FixationSessionAnswer';
import styles from './FixationPlayerQuestion.module.scss';

interface FixationPlayerQuestionProps {
  displayName: string;
  questionId: number;
  questionTxt: string;
  webSocket: WebSocket;
}

const FixationPlayerQuestion: FC<FixationPlayerQuestionProps> = (props) => {
  const [answers, setAnswers] = useState<FixationAnswer[]>([]);
  const webSocket = useRef<WebSocket>(props.webSocket);
  
  useEffect(() => {
    getFixationQuestionAnswers(props.questionId)
      .then((response) => {
        setAnswers(response);
      })
      .catch((error: Error) => {
        console.log(error.message);
      })
  }, [props.questionId]);

  const submitAnswer = (answerId: number) => {
    // TODO: update to SubmitAnswer event type
    console.log(answerId);
    let message: any = {
      model: "answered",
      payload: {
        display_name: props.displayName,
        answer_id: answerId
      }
    };
    webSocket.current.send(JSON.stringify(message));
  }

  return (
    <div className={styles.FixationPlayerQuestion} data-testid="FixationPlayerQuestion">
      <FixationSessionAnswer answers={answers} isMultipleChoice={true} revealAnswers={false} isPlayer={true} submitAnswerCallback={submitAnswer}/>
    </div>
  );
}

export default FixationPlayerQuestion;
