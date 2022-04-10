import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';
import { randomUniqueNumberList } from '../../../utils/randomFunctions';
import styles from '../ReactSpotifyWebPlayback.module.scss';

interface AlbumCoverHolderProps {
  id: string;
  alt: string;
  src: string;
  durationMs: number;
  doShow: boolean;
}

const AlbumCoverHolder = (props: AlbumCoverHolderProps) => {
  const squareLength = Math.floor(Math.sqrt(324)) // 1 square for every second (30000 / 100 = 300)
  const arrayLength = Math.pow(squareLength, 2);
  const percentFill = 100 * squareLength / arrayLength
  const pixelStyle = {
    width: `${percentFill}%`,
    height: `${percentFill}%`
  }
  const [divArray, setDivArray] = useState(Array(arrayLength).fill(true));
  const [pixelOrderToRemove, setPixelOrderToRemove] = useState<number[]>();

  const [intervalTime, setIntervalTime] = useState<number>(Math.ceil(props.durationMs / arrayLength));

  useEffect(() => {
    setDivArray(Array(arrayLength).fill(true));
    setPixelOrderToRemove( randomUniqueNumberList(arrayLength));
  }, [props.src])

  useEffect(() => {
    setIntervalTime(Math.ceil(props.durationMs / arrayLength));
  }, [props.durationMs])

  const showPixel = () => {
    if (!props.doShow) {
      return
    }
    let ind = pixelOrderToRemove?.pop() as number;
    divArray[ind] = false;
  }

  //TODO: remove pixel with beat of song?? or add dynamic pacing (reveal more quickly as time moves along)
  useInterval(showPixel, pixelOrderToRemove?.length && intervalTime ? intervalTime : null)

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