import React from 'react';
import styles from './FixationSessionStart.module.scss';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

interface FixationSessionStartProps {
  sessionCode: string;
  startFixationSessionCallback: () => void;
}

const FixationSessionStart = (props: FixationSessionStartProps) => {
  return (
    <div className={styles.FixationSessionStart} data-testid="FixationSessionStart">
      <Card>
        <CardContent className={styles.cardContent}>
          <Typography variant="overline" display="block">
            Fixation Code
          </Typography>
          <Typography variant="h3">
            {props.sessionCode}
          </Typography>
        </CardContent>
        <CardActions className="card-actions">
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            onClick={props.startFixationSessionCallback}>
            Everybody's In
          </Button>
        </CardActions>
      </Card>

    </div>
  );
}

export default FixationSessionStart;
