import React, { useEffect, useState } from 'react';
import styles from './AppRouter.module.scss';
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import Loader from '../Loader/Loader';
import Welcome from '../Welcome/Welcome';
import FixationList from '../FixationList/FixationList';
import FixationView from '../FixationView/FixationView';
import FixationStart from '../FixationStart/FixationStart';
import FixationSessionHost from '../FixationSessionHost/FixationSessionHost';
import { webSocketConnectionString } from '../../websockets/websockets';
import FixationPlayer from '../FixationPlayer/FixationPlayer';
import { checkAuthentication, getAuthUrl } from '../../services/spotify.service';
import UserForm from '../UserForm/UserForm';
import UserProfile from '../UserProfile/UserProfile';
import { accessToken, refreshToken, spotifyAuthenticated } from '../../utils/constants';
import { getUser } from '../../services/user.service';
import FixationCreate from '../FixationCreate/FixationCreate';
import FixationQuestionCreate from '../FixationQuestionCreate/FixationQuestionCreate';
import { HypertriviationUser } from '../../interfaces/HypertriviationUser';

const AppRouter = () => {
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<HypertriviationUser>();
  const [webSocket, setWebSocket] = useState<WebSocket>();

  useEffect(() => {
    checkUserSignedIn();
  }, [])

  const checkUserSignedIn = () => {
    if (localStorage.getItem(accessToken) && localStorage.getItem(refreshToken)) {
      getUser()
      .then((user)=> {
        setIsLoggedIn(true);
        setUser(user);
        setIsSpotifyAuthenticated(user.spotifyAuthenticatedInd);
        localStorage.setItem(spotifyAuthenticated, String(user.spotifyAuthenticatedInd));
      })
      .catch((error: Error) => {
        console.log(error.message)
      })
    }
    else {
      setIsLoggedIn(false);
    }
  }

  const authenticateSpotify = (userId: number) => {
    checkAuthentication(userId)
      .then((data) => {
        console.log(data.status);
        setIsSpotifyAuthenticated(data.status);
        if (!data.status) {
          getAuthUrl(userId)
            .then((response) => {
              console.log(response)
              window.location.replace(response.url)
            });
        }
      })
      .catch((error: Error) => console.log(error.message));
  };

  const handleSpotifyAuthentication = (status: boolean) => {
    setIsSpotifyAuthenticated(status);
  }

  const handleWebSocketConnection = (newWebSocket: WebSocket) => {
    setWebSocket(newWebSocket);
  }

  return (
    <div className={styles.AppRouter} data-testid="AppRouter">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome isLoggedIn={isLoggedIn}/>}>
          </Route>
          {user ? <Route path="/fixations/create" element={<FixationCreate userId={user.id}/>} /> : null }
          {user ? <Route path="/fixations/create/:fixationId" element={<FixationQuestionCreate userId={user.id}/>}/> : null }
          <Route path="/fixations/list" element={<FixationList />} />
          {
            user
            ? 
            <Route path="/fixations/:roomName"
              element={
                <FixationView
                  isSpotifyAuthenticated={isSpotifyAuthenticated}
                  user={user}
                  setWebSocket={handleWebSocketConnection}
                />
              }
            />
            :
            null
          }
          {
            user && webSocket
            ?
            <Route path="/fixations/session/:code"
              element={
                <FixationSessionHost
                  webSocket={webSocket}
                  isSpotifyAuthenticated={isSpotifyAuthenticated}
                  hostUser={user}
                />
              }
            />
            :
            null
          }
          <Route path="/live" element={<FixationPlayer/>} />
          <Route path="/user/access" element={<UserForm/>}/>
          <Route path="/user/myaccount" element={<UserProfile handleSpotifyAuthenticationCallback={authenticateSpotify}/>}/>
          
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
