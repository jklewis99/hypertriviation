import React, { useState } from 'react';
import styles from './Loader.module.scss';
import brainVector from '../../assets/icons/brain-vector.svg';
import brain from '../../assets/icons/brain.svg';
import jimmyneutron from '../../assets/images/jimmy-neutron.png';

const Loader = () => {
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // setTimeout(() => {
  //   setIsLoading(true);
  // }, 3000);

  // if (!isLoading) {
    return (
      <div className={styles.Loader} data-testid="Loader">
        <img src={brain} className={`${styles.brainLoader} ${styles.centered}`} alt="orbiter1"></img>
        <img src={brainVector} className={`${styles.brainVector} ${styles.centered}`} alt="logo" />
      </div>
    );
  // }
  // else {
  //   return (
  //     <div className={styles.Loader} data-testid="Loader">
  //       <img src={jimmyneutron} className={`${styles.jimmyNeutron} ${styles.centered}`} alt="logo" />
  //     </div>
  //   )
  // }
}

export default Loader;
