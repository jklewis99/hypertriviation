import { Card, CardContent, Grid, Typography } from '@mui/material';
import React, { FC } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { knuthShuffle } from '../../utils/randomFunctions';
import styles from './FixationSessionAnswer.module.scss';
import math from '../../assets/icons/math.svg';
import science from '../../assets/icons/science.svg';
import drama from '../../assets/icons/drama.svg';
import music from '../../assets/icons/music.svg';
import puzzle from '../../assets/icons/puzzle.svg';
import FixationAnswerCard from '../FixationAnswerCard/FixationAnswerCard';

interface FixationSessionAnswerProps {
  answers: FixationAnswer[];
  revealAnswers: boolean;
  isMultipleChoice: boolean;
  isPlayer?: boolean;
  submitAnswerCallback?: (answerTxt: string, answerId?: number) => void;
}

const FixationSessionAnswer: FC<FixationSessionAnswerProps> = (props) => {

  const handleAnswerClick = (answerTxt: string, answerId?: number) => {
    if (props.submitAnswerCallback) {
      props.submitAnswerCallback(answerTxt, answerId);
    }

  }

  const answers = props.answers;
  if (props.isMultipleChoice) {
    return (
      // <div className={styles.FixationSessionAnswer} data-testid="FixationSessionAnswer">
        <Grid 
          container
          className={styles.FixationSessionAnswer}
          data-testid="FixationSessionAnswer"
          rowSpacing={{ xs: 1, sm: 2, md: 2 }}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          {answers.map((answer: FixationAnswer, i: number) => (
            <Grid item xs={6} >
              <FixationAnswerCard
                answerId={answer.id}
                answerTxt={answer.answerTxt}
                clickable={props.isPlayer || false}
                reveal={props.revealAnswers}
                isCorrect={answer.correctAnswerInd}
                styleIdx={i}
                onClick={handleAnswerClick}
              />
              {/* <Card
                className={`${styles.answerCard}
                            ${props.revealAnswers 
                              ? (!answer.correctAnswerInd ? styles.wrongAnswerCard : styles.correctAnswerCard) : ''}
                            ${props.isPlayer ? styles.clickable : ''}`}
                style={props.revealAnswers && !answer.correctAnswerInd ? {} : answerOptionsStyles[i]}
                onClick={() => handleAnswerClick(answer.id, answer.answerTxt)}
              >
                <CardContent>
                  {answerIcons[i]}
                  <Typography>
                    {answer.answerTxt}
                  </Typography>
                </CardContent>
                
              </Card> */}
            </Grid>
          ))}
        </Grid>
      // </div>
    );
  }
  if (props.revealAnswers) {
    return (
      <div className={styles.FixationSessionAnswer} data-testid="FixationSessionAnswer">
        {answers.filter((answer: FixationAnswer) => answer.correctAnswerInd).map((answer: FixationAnswer, i: number) => (
          <Card>
            <Typography>
              {answer.answerTxt}
            </Typography>                
          </Card>
        ))}
      </div>
    )
  }
  return <></>
}

export default FixationSessionAnswer;
