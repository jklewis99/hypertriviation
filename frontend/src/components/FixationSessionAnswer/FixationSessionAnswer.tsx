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

interface FixationSessionAnswerProps {
  answers: FixationAnswer[];
  revealAnswers: boolean;
  isMultipleChoice: boolean;
  isPlayer?: boolean;
  submitAnswerCallback?: (answerId: number) => void;
}

const FixationSessionAnswer: FC<FixationSessionAnswerProps> = (props) => {

  const handleAnswerClick = (answerId: number) => {
    if (props.submitAnswerCallback) {
      props.submitAnswerCallback(answerId);
    }

  }
  const answerOptionsStyles = [
    {
      backgroundColor: "#4287f5"
    },
    {
      backgroundColor: "#f59b42"
    },
    {
      backgroundColor: "#44d471"
    },
    {
      backgroundColor: "#d44450"
    },
    {
      backgroundColor: "orange"
    }
  ];

  const answerIcons = [
    <img src={math}/>,
    <img src={science} />,
    <img src={drama} />,
    <img src={music}/>,
    <img src={puzzle} />,
  ]

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
              <Card
                className={`${styles.answerCard}
                            ${props.revealAnswers 
                              ? (!answer.correctAnswerInd ? styles.wrongAnswerCard : styles.correctAnswerCard) : ''}
                            ${props.isPlayer ? styles.clickable : ''}`}
                style={props.revealAnswers && !answer.correctAnswerInd ? {} : answerOptionsStyles[i]}
                onClick={() => handleAnswerClick(answer.id)}
              >
                <CardContent>
                  {answerIcons[i]}
                  <Typography>
                    {answer.answerTxt}
                  </Typography>
                </CardContent>
                
              </Card>
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
