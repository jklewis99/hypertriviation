import { Card, CardContent, Typography } from '@mui/material';
import React, { FC } from 'react';
import styles from './FixationAnswerCard.module.scss';
import math from '../../assets/icons/math.svg';
import science from '../../assets/icons/science.svg';
import drama from '../../assets/icons/drama.svg';
import music from '../../assets/icons/music.svg';
import puzzle from '../../assets/icons/puzzle.svg';

interface FixationAnswerCardProps {
  answerId?: number;
  answerTxt: string;
  isCorrect?: boolean;
  reveal?: boolean;
  clickable?: boolean;
  styleIdx?: number;
  onClick?: (answerTxt: string, answerId?: number, ) => void;
}

const FixationAnswerCard: FC<FixationAnswerCardProps> = (props) => {

  const handleClickEvent = (answerTxt: string, answerId?: number) => {
    if (props.onClick) {
      props.onClick(props.answerTxt, props.answerId)
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

  return (
    <Card
      className={`${styles.FixationAnswerCard}
                  ${props.reveal 
                    ? (!props.isCorrect ? styles.wrongAnswerCard : styles.correctAnswerCard) : ''}
                  ${props.clickable ? styles.clickable : ''}`}
      style={props.reveal && !props.isCorrect ? {} : answerOptionsStyles[props.styleIdx || 0]}
      onClick={() => handleClickEvent(props.answerTxt, props.answerId)}
    >
      <CardContent>
        {answerIcons[props.styleIdx || 0]}
        <Typography>
          {props.answerTxt}
        </Typography>
      </CardContent>
      
    </Card>
);
  }

export default FixationAnswerCard;
