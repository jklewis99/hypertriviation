import { Button, Card, CardActions, CardContent, CardHeader, ClickAwayListener, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC, useEffect, useState } from 'react';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { SubmittedAnswer } from '../../interfaces/SubmittedAnswer';
import FixationAnswerCard from '../FixationAnswerCard/FixationAnswerCard';
import FixationSessionAnswer from '../FixationSessionAnswer/FixationSessionAnswer';
import styles from './FixationSessionAnswerPopup.module.scss';

interface FixationSessionAnswerPopupProps {
  submittedAnswer: SubmittedAnswer;
  answers: FixationAnswer[];
  playerIcon?: any; // TODO
  closeModalCallback: (goToNextQuestion?: boolean) => void;
}

const FixationSessionAnswerPopup: FC<FixationSessionAnswerPopupProps> = (props) => {
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false);
  const [countCorrect, setCountCorrect] = useState<number>(0);

  useEffect(() => {
    setCountCorrect(props.answers.filter(answer => answer.correctAnswerInd).length);
    setInterval(() => {
      setRevealAnswer(true);
    }, 3000)
  }, [])

  return (
    <ClickAwayListener onClickAway={() => props.closeModalCallback()}>
      <Card className={styles.FixationSessionAnswerPopup} data-testid="FixationSessionAnswerPopup">
        <CardHeader title={`Answer from ${props.submittedAnswer.playerUsername}...`}/>
        <CardContent>
          <FixationAnswerCard
            answerTxt={props.submittedAnswer.submittedAnswerTxt}
            clickable={false}
            reveal={false}
            isCorrect={false}
            styleIdx={props.submittedAnswer.answerIdx || 0}
          />
        </CardContent>
        {
          !revealAnswer
          ?
          <Typography>
            Drumroll please...
          </Typography>
          :
          <Box>
            {
              props.submittedAnswer.isCorrectAnswer
              ?
              <Box>
                <Typography variant="overline">Correct!</Typography>
                {/* is it not multiple choice, say what the user said */}
                <Typography> Congrats, kid!</Typography>
              </Box>
              :
              <Typography variant="overline">{`Whoops... That's incorrect! The correct answer${countCorrect > 1 ? 's are' : ' is'}...`}</Typography>
            }
          </Box>
        }

        <FixationSessionAnswer
          answers={props.answers}
          revealAnswers={revealAnswer}
          isMultipleChoice={true}
        />
        <CardActions className={'card-actions-spread'}>
          <Button size="medium" variant="contained" color="secondary" onClick={() => props.closeModalCallback(true)} style={{ margin: "10px 20px" }}>Next</Button>
        </CardActions>
      </Card>
    </ClickAwayListener>
  );
}

export default FixationSessionAnswerPopup;
