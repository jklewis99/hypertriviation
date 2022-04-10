import React from 'react';
import styles from './Welcome.module.scss';
import { Grid, Button, ButtonGroup, Typography, IconButton } from "@mui/material";
// import InfoIcon from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import hypertriviation from '../../assets/icons/hypertriviation.svg';
import math from '../../assets/icons/math.svg';
import science from '../../assets/icons/science.svg';
import drama from '../../assets/icons/drama.svg';
import music from '../../assets/icons/music.svg';
import puzzle from '../../assets/icons/puzzle.svg';

interface WelcomeProps {
  isLoggedIn: boolean;
}

const Welcome = (props: WelcomeProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const goToMyAccount = () => {
    navigate("/user/myaccount");
  }
  const goToSignIn = () => {
    navigate("/user/access");
  }
  const isLoggedIn = props.isLoggedIn || location?.state?.isLoggedIn || false

  return (
    <div className={styles.Welcome}>
      <div className={styles.welcomeMain} data-testid="Welcome">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3">
              <img src={hypertriviation} className={styles.logo} alt="logo" />
              <img src={math} className={`${styles.orbiter} ${styles.offset1}`} alt="orbiter1" />
              <img src={science} className={`${styles.orbiter} ${styles.offset2}`} alt="orbiter2" />
              <img src={drama} className={`${styles.orbiter} ${styles.offset3}`} alt="orbiter3" />
              <img src={music} className={`${styles.orbiter} ${styles.offset4}`} alt="orbiter4" />
              <img src={puzzle} className={`${styles.orbiter} ${styles.offset5}`} alt="orbiter5" />
            </Typography>
            <IconButton>
              {/* <InfoIcon style={{color: "white"}}/> */}
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/live" component={Link}>
                Join a Session
              </Button>
              <Button color="secondary" to="/fixations/list" component={Link}>
                Start a Fixation
              </Button>
              <Button color="secondary" to="/fixations/create" component={Link}>
                Create a Fixation
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
      <Button className={styles.myAccountButton} variant="contained" color="primary" onClick={isLoggedIn ? goToMyAccount : goToSignIn}>
        {isLoggedIn ? "My Account" : "Log In/Sign Up"}
      </Button>
    </div>
  );
}

export default Welcome;
