import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';
import { randomUniqueNumberList } from '../../../utils/randomFunctions';
import styles from '../ReactSpotifyWebPlayback.module.scss';

interface Props {
  id: string;
  alt: string;
  src: string;
  timeLimit: number;
}

const AlbumCoverHolder = (props: Props) => {
  const squareLength = Math.floor(Math.sqrt(props.timeLimit * 10))
  const arrayLength = Math.pow(squareLength, 2);
  const percentFill = 100 * squareLength / arrayLength
  const pixelStyle = {
    width: `${percentFill}%`,
    height: `${percentFill}%`
  }
  const [divArray, setDivArray] = useState(Array(arrayLength).fill(true));
  const [pixelOrderToRemove, setPixelOrderToRemove] = useState<number[]>();

  useEffect(() => {
    console.log(arrayLength);
    console.log(pixelOrderToRemove);
    setDivArray(Array(arrayLength).fill(true));
    setPixelOrderToRemove( randomUniqueNumberList(arrayLength));
  }, [props.src])

  const showPixel = () => {
    let ind = pixelOrderToRemove?.pop() as number;
    divArray[ind] = false;
  }

  //TODO: remove pixel with beat of song??
  useInterval(showPixel, pixelOrderToRemove?.length ? 1000 : null)

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