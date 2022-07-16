import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FixationCard.module.scss';
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Rating, Typography } from "@mui/material";
import { Fixation } from '../../interfaces/Fixation';
import { Info, PlayArrow, Share } from '@mui/icons-material';

interface FixationCardProps {
  fixation: Fixation;
  orientation?: boolean;
}

const FixationCard = (props: FixationCardProps) => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState<boolean>(false);

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
    <div className={styles.SessionCard} data-testid="SessionCard">
      
      <Card
        className={styles.largeCard}
      >
        {
        !showInfo
        ? 
        <CardMedia
          component="img"
          sx={{ width: "100%" }}
          height="60%"
          image={props.fixation.imgUrl}
          alt={props.fixation.fixationTitle + " img"}
        />
        :
        null
        }
        {
        !showInfo
        ? 
        <Box
          sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "ellipsis",
              padding: "8px 2px"
            }}
        >
          <Typography width={"100%"} variant='subtitle2' noWrap>
            {props.fixation.fixationTitle}
          </Typography>
          <Divider variant="middle" />
          <Typography width={"100%"} variant='caption' color={"#838383"}>
            {props.fixation.createdBy}
          </Typography>
        </Box>
        :
        <CardContent>
          <Typography>
          {props.fixation.description}
            </Typography>
        </CardContent>
        }
        <CardActions style={{padding: "0 5px"}} className={'card-actions-spread'}>
          <IconButton  size="small" onClick={() => setShowInfo(!showInfo)}>
            <Info fontSize="small" />
          </IconButton>
          {/* <IconButton  size="small" disabled>
            <Share />
          </IconButton> */}
          <IconButton size="small">
            <PlayArrow onClick={goToFixationStart}/>
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default FixationCard;
