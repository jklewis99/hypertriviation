import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import { FixationSessionInstructionsProps } from '../../interfaces/props/FixationSessionInstructions.props';
import styles from './FixationSessionInstructions.module.scss';

const FixationSessionInstructions = (props: FixationSessionInstructionsProps) => {


  return (
    <div className={styles.FixationSessionInstructions} data-testid="FixationSessionInstructions">
      <Card>
        <CardHeader title="Here are the instructons to  Fixation" />
        <CardContent>
          <Typography>
            TODO: directions based on category
          </Typography>
          <Typography>
            TODO: If multiple choice, tell multiple choice
          </Typography>
          <Typography>
            TODO: If hints, tell when hints will show
          </Typography>
          <Typography>
            TODO: show time limit
          </Typography>
          <Typography>
            TODO: tell about stop on answer
          </Typography>
        </CardContent>
        <CardActions className="card-actions">
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            onClick={props.displayFixationQuestionsCallback}>
            Let's Get Started
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default FixationSessionInstructions;
