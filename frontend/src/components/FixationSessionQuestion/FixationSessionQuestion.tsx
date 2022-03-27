import { Card, CardContent, Typography } from '@mui/material';
import React, { FC } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import styles from './FixationSessionQuestion.module.scss';

interface FixationSessionQuestionProps {
  fixationQuestion: FixationQuestion;
  fixationQuestionAnswers: FixationAnswer[];
}

const FixationSessionQuestion: FC<FixationSessionQuestionProps> = (props) => {
  const fixationQuestion = props.fixationQuestion;
  const fixationQuestionAnswers = props.fixationQuestionAnswers;

  return (
    <div className={styles.FixationSessionQuestion} data-testid="FixationSessionQuestion">
      <Card>
        <CardContent>
          <Typography>
            Question #{fixationQuestion.questionIdx}
          </Typography>
          <Typography>
            {fixationQuestion.questionTxt}
          </Typography>
          {/* img_url */}
          {/* video_url */}
          {/* spotify_url? */}
        </CardContent>

        <CardContent>
          <Typography>
            Answers
          </Typography>
          {
            fixationQuestionAnswers.map((fixation: FixationAnswer) => {
              <Typography>
                {fixation.answerTxt}
                {fixation.correctAnswerInd ? "correct" : "incorrect"}
              </Typography>
            })
          }
          {/* img_url */}
          {/* video_url */}
          {/* spotify_url? */}
        </CardContent>
        
      </Card>
    </div>
  );
}

export default FixationSessionQuestion;
