import { Card, Grid, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { FixationSessionPlayer } from '../../interfaces/FixationSessionPlayer';
import styles from './FixationSessionPlayersList.module.scss';
import hypertriviationLogo from '../../assets/icons/hypertriviation-small-bw.svg';
import beeFire from '../../assets/icons/bee-fire.svg';
import beeBroken from '../../assets/icons/bee-broken.svg';
import beeConfused from '../../assets/icons/bee-confused.svg';
import beeFistBump from '../../assets/icons/bee-fist-bump.svg';
import beeHighFive from '../../assets/icons/bee-high-five.svg';
import beeLaunch from '../../assets/icons/bee-launch.svg';
import beeLove from '../../assets/icons/bee-love.svg';
import beeMusic from '../../assets/icons/bee-music.svg';
import beeSad from '../../assets/icons/bee-sad.svg';
import beeScared from '../../assets/icons/bee-scared.svg';
import beeSick from '../../assets/icons/bee-sick.svg';
import beeSurprised from '../../assets/icons/bee-surprised.svg';
import beeWave from '../../assets/icons/bee-wave.svg';
import { Box } from '@mui/system';

interface FixationSessionPlayersListProps {
  players: FixationSessionPlayer[];
  lastAnsweredUser?: string;
}

const FixationSessionPlayersList: FC<FixationSessionPlayersListProps> = (props) => {
  const [players, setPlayers] = useState<FixationSessionPlayer[]>(props.players);
  useEffect(() => {
    if (props.lastAnsweredUser) {
      let idx = players.findIndex(player => {
        return player.displayName === props.lastAnsweredUser;
      });
      players[idx].answered = true;
    }
    else {
      // when lastAnsweredUser is undefined, all not users will show as "answered"
      players.forEach(player => {
        player.answered = false;
      })
    }
    setPlayers([...players]);
  }, [props.lastAnsweredUser]);

  const themes = [
    {backgroundColor: "#9455d9"},
    {backgroundColor: "#d97155"},
    {backgroundColor: "#7ed955"},
    {backgroundColor: "#d9558e"},
    {backgroundColor: "#5571d9"},
    {backgroundColor: "#d95555"},
    {backgroundColor: "#55d997"},
    {backgroundColor: "#6055d9"},
  ];

  const avatarAnswers = [
    <img src={beeFire} className={styles.answered} />,
    <img src={beeBroken} className={styles.answered} />,
    <img src={beeConfused} className={styles.answered} />,
    <img src={beeFistBump} className={styles.answered} />,
    <img src={beeHighFive} className={styles.answered} />,
    <img src={beeLaunch} className={styles.answered} />,
    <img src={beeLove} className={styles.answered} />,
    <img src={beeMusic} className={styles.answered} />,
    <img src={beeSad} className={styles.answered} />,
    <img src={beeScared} className={styles.answered} />,
    <img src={beeSick} className={styles.answered} />,
    <img src={beeSurprised} className={styles.answered} />,
    <img src={beeWave} className={styles.answered} />
  ]

  return (
    <Grid
      className={styles.FixationSessionPlayersList}
      data-testid="FixationSessionPlayersList"
      container spacing={2}
      justifyContent={"space-between"}
      alignItems={"space-between"}
    >
      {
        players.map((player: FixationSessionPlayer, i: number) => (
          <Grid item className={styles.fixationSessionPlayer} sx={themes[i % themes.length]} width={`${100 / players.length}%`}>
            <Box>
              <Typography>
                
            {player.displayName}
              </Typography>

            </Box>
            <Box>
            {
              props.lastAnsweredUser && (player.answered || player.displayName === props.lastAnsweredUser)
              ?
              avatarAnswers[i % avatarAnswers.length]
              :
              <img src={hypertriviationLogo} className={styles.thinking}></img>
            }

            </Box>
          </Grid>
        ))
      }
    </Grid>
  );
}

export default FixationSessionPlayersList;
