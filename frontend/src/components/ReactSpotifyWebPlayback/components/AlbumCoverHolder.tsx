import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';
import { randomUniqueNumberList } from '../../../utils/randomFunctions';
import styles from '../ReactSpotifyWebPlayback.module.scss';

interface AlbumCoverHolderProps {
  id: string;
  alt: string;
  src: string;
  timeLimit: number;
  timeRemaining: number;
}

const AlbumCoverHolder = (props: AlbumCoverHolderProps) => {
  const squareLength = Math.floor(Math.sqrt(props.timeLimit * 10))
  const arrayLength = Math.pow(squareLength, 2);
  const percentFill = 100 * squareLength / arrayLength
  const pixelStyle = {
    width: `${percentFill}%`,
    height: `${percentFill}%`
  }
  const [divArray, setDivArray] = useState(Array(arrayLength).fill(true));
  const [pixelOrderToRemove, setPixelOrderToRemove] = useState<number[]>();
  const [intervalTime, setIntervalTime] = useState<number>(1000);

  useEffect(() => {
    setDivArray(Array(arrayLength).fill(true));
    setPixelOrderToRemove( randomUniqueNumberList(arrayLength));
  }, [props.src])

  useEffect(() => {
    if (pixelOrderToRemove?.length) {
      setIntervalTime(Math.ceil(props.timeRemaining / pixelOrderToRemove.length))
    }
  }, [props.timeRemaining])

  const showPixel = () => {
    let ind = pixelOrderToRemove?.pop() as number;
    divArray[ind] = false;
  }

  //TODO: remove pixel with beat of song?? or add dynamic pacing (reveal more quickly as time moves along)
  useInterval(showPixel, pixelOrderToRemove?.length ? intervalTime : null)

  return (
    <div className={styles.albumCoverContainer}>
      <div className={styles.albumCoverImage}>
      <img id="album-image" alt={props.alt} src={props.src} style={{ maxWidth: '100%' }} />
      </div>
      <div className={styles.albumCoverCurtain}>
        {divArray.map((ele) => {
          return <div className={ele ? styles.repeatingPixels : ""} style={pixelStyle}/>
        })

        }
      </div>
    </div>
  )
}

export default AlbumCoverHolder;