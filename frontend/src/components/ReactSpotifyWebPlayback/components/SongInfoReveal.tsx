import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';
import { randomUniqueNumberList } from '../../../utils/numbers';
import styles from '../ReactSpotifyWebPlayback.module.scss';

interface Props {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit" | undefined;
  name: string;
  timeLimit: number;
  revealPace: number;
}

const SongInfoReveal = (props: Props) => {
  const nameCharArray = [...props.name];
  const [charOrderToRemove, setCharOrderToRemove] = useState<number[]>();

  const setHiddenCharacters = (nameString: string) => {
    let name = [];
    for (var i = 0; i < nameString.length; i++) {
      if (nameString[i] === " ") {
        name.push(" ");
      } else {
        name.push("_");
      }
    }
    return name
  }

  const [displayName, setDisplayName] = useState<string[]>();

  useEffect(() => {
    setDisplayName(setHiddenCharacters(props.name));
    setCharOrderToRemove(randomUniqueNumberList(props.name.length));
  }, [props.name])

  const showCharacter = () => {
    let ind = charOrderToRemove?.pop() as number;
    //@ts-ignore
    displayName[ind] = nameCharArray[ind];
    
  }

  useInterval(showCharacter, charOrderToRemove?.length ? props.revealPace : null)

  return (
    <Typography variant={props.variant}>
      {displayName?.join("")}
    </Typography>
  )
}

export default SongInfoReveal;