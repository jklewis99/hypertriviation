import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FixationCard.module.scss';
import { FixationCardProps } from '../../interfaces/props/FixationCard.props';
import { Card, CardContent, CardHeader, Rating, Typography } from "@mui/material";

const FixationCard = (props: FixationCardProps) => {
  const navigate = useNavigate();

  const backgroundImage = {
    backgroundImage: `url(${props.fixation.imgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }
  const darkenedBackgroundImage = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(80, 0, 0, 0.85),rgba(0, 0, 60, 0.85)), url(${props.fixation.imgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }

  const goToFixationStart = () => {
    navigate(`/fixations/${props.fixation.fixationTitle}`, {state: props.fixation});
  }

  return (
    <div className={styles.SessionCard} data-testid="SessionCard" onClick={goToFixationStart}>
      <div className={styles.flipCard}>
        <div className={styles.flipCardInner}>
          <Card
            className={styles.flipCardFront}
            style={backgroundImage}>
            <CardHeader
              title={props.fixation.fixationTitle}
              subheader={props.fixation.createdBy}
              titleTypographyProps={{
                align: 'center',
                // justifyContent: 'center',
                className: styles.cardInfoBackground
              }}
              subheaderTypographyProps={{
                align: 'center',
                // justifyContent: 'center',
                className: styles.cardInfoBackground
              }}
            />
            {/* <Rating name="half-rating-read" defaultValue={props.fixation.rating} precision={0.5} readOnly /> */}
          </Card>
          <Card className={styles.flipCardBack} style={darkenedBackgroundImage}>
            <CardContent>
              <Typography>
              {props.fixation.description}
                </Typography>
            </CardContent>
            
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FixationCard;
