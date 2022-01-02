import React, { useEffect, useState } from 'react';
// import styles from './UserProfile.module.scss';
import styles from '../UserForm/UserForm.module.scss';
import {
  Avatar, Button, FormControl,
  IconButton, Input, InputAdornment,
  InputLabel, Paper, Snackbar, SnackbarContent, Card, CardHeader, Typography
} from '@mui/material';
import spotify from '../../assets/icons/spotify.svg';
import { ReactComponent as SpotifyIcon } from '../../assets/icons/spotify.svg';
import { getUser } from '../../services/user.service';
import { HypertriviationUser } from '../../interfaces/HypertriviationUser';
import { useNavigate, useLocation } from 'react-router-dom'
import { UserProfileProps } from '../../interfaces/props/UserProfile.props';
import { getPlaylists, setTokens } from '../../services/spotify.service';
import { spotifyAuthenticated } from '../../utils/constants';

const UserProfile = (props: UserProfileProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<HypertriviationUser>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    spotifyAuthenticatedInd: false,
    id: 0
  });

  useEffect(() => {
    getUser()
    .then((user) => {
      setUser(user);
      if (user.spotifyAuthenticatedInd) {
        localStorage.setItem(spotifyAuthenticated, "true");
      }
    })
    .catch((error: Error) => {
      console.log(error.message);
    })
  }, [])

  useEffect(() => {
    if (!location.search || user.id === 0) return;
    let requestBody: {[key: string]: string | number} = {
      userId: user.id,
    }
    const queryParams = new URLSearchParams(location.search)
    for( let [key, value] of queryParams.entries()){
      console.log(key, value);
      requestBody[key] = value;
    }
    if (requestBody.error) {
      setErrorMessage(requestBody.error as string);
      // show the message
      console.log(errorMessage);
      return;
    }
    else {
      // query backend to update
      setTokens(requestBody)
      .then((data) => {
        console.log(data);
      })
      .finally(() => {
        navigate('');
      })
    }
  }, [user])

  const connectSpotify = () => {
    props.handleSpotifyAuthenticationCallback(user.id);
  }

  const getMyPlaylists = () => {
    getPlaylists(user.id).then((response: any) => {
      debugger;
      console.log(response);
    })
    .catch((error: Error) => {
      console.log(error);
    })
  }
  return (
    <div className={styles.UserForm} data-testid="UserProfile">
      <Card className={styles.paper}>
        <CardHeader title={"My Account"} var/>
        <div
          className={styles.form}
        >
          <InputLabel className={styles.labels}>
            Username
          </InputLabel>
          <Typography gutterBottom variant="h6">
            {user.username}
          </Typography>


          <InputLabel htmlFor="email" className={styles.labels}>
            First Name
          </InputLabel>
          <Typography gutterBottom variant="h6">
            {user.firstName}
          </Typography>


          <InputLabel htmlFor="email" className={styles.labels}>
            Last Name
          </InputLabel>
          <Typography gutterBottom variant="h6">
            {user.lastName}
          </Typography>

          <InputLabel htmlFor="email" className={styles.labels}>
            E-mail
          </InputLabel>
          <Typography gutterBottom variant="h6">
            {user.email}
          </Typography>
          <InputLabel htmlFor="email" className={styles.labels}>
            Spotify Authenticated?
          </InputLabel>
          <Typography gutterBottom style={{ display: "flex", alignItems: "center", justifyContent: "center" }} variant="h6">
            <SpotifyIcon className={styles.spotify} /> {user.spotifyAuthenticatedInd ? "Yes" : "No"}
            {!user.spotifyAuthenticatedInd ? <Button onClick={connectSpotify}>Connect Spotify</Button> : null }
          </Typography>
          {user.spotifyAuthenticatedInd ? <Button onClick={getMyPlaylists}>get my playlists</Button> : null }

          <Button
            // disabled={!isValid()}
            fullWidth
            variant="outlined"
            className={styles.button}
            // onClick={handleSubmit}
            sx={{
              ':hover': {
                color: 'black',
                borderColor: 'white'
              }
            }
            }
          >
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default UserProfile;
