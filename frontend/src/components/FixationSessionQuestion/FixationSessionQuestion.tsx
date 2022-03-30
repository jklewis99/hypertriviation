import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React, { FC } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import styles from './FixationSessionQuestion.module.scss';

interface FixationSessionQuestionProps {
  question: FixationQuestion;
  questionIdx: number;
  answers: FixationAnswer[];
  goToNextQuestionCallback: () => void;
}

const FixationSessionQuestion: FC<FixationSessionQuestionProps> = (props) => {
  const fixationQuestion = props.question;
  const fixationQuestionAnswers = props.answers;
  const questionIdx = props.questionIdx;

  return (
    <div className={styles.FixationSessionQuestion} data-testid="FixationSessionQuestion">
      <Card>
        <CardContent>
          <Typography>
            Question #{questionIdx}
          </Typography>
          <Typography>
            {fixationQuestion.questionTxt}
          </Typography>
          {/* img_url */}
          {/* video_url */}
          {/* spotify_url? */}
        </CardContent>

        <CardContent>
          {/* img_url */}
          {/* video_url */}
          {/* spotify_url? */}
        </CardContent>
        <CardActions className="card-actions">
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            onClick={props.goToNextQuestionCallback}>
            Next
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default FixationSessionQuestion;
