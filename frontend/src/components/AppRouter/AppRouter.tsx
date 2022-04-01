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
  const webSocket = new WebSocket(webSocketConnectionString)

  const connectWebSocket = () => {
    webSocket.onopen = (event) => console.log("WebSocket connected!");
    webSocket.onmessage = (event) => console.log("EVENT DATA: ", event.data);
    webSocket.onclose = (event) => {
      console.log(
        `WebSocket is closed. Reconnect will be attempted in 1 second.`,
        event.reason
      );
      setTimeout(() => {
        connectWebSocket();
      }, 1000);
    };
    webSocket.onerror = (event: Event) => {
      console.error(
        "WebSocket encountered error: ",
        event,
        "Closing socket"
      )
      webSocket.close();
    };

    // if (webSocket.readyState == WebSocket.OPEN) {
    //   webSocket.onopen = () => {
    //     console.log("Websocket is open now");
    //   };
    // }
  }

  useEffect(() => {
    connectWebSocket();
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

  return (
    <div className={styles.AppRouter} data-testid="AppRouter">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome isLoggedIn={isLoggedIn}/>}>
          </Route>
          {user ? <Route path="/fixations/create" element={<FixationCreate userId={user.id}/>} /> : null }
          {user ? <Route path="/fixations/create/:fixationId" element={<FixationQuestionCreate userId={user.id}/>}/> : null }
          <Route path="/fixations/list" element={<FixationList />} />
          <Route path="/fixations/:roomName" element={<FixationView isSpotifyAuthenticated={isSpotifyAuthenticated} />} />
          <Route path="/fixations/session/:code" element={<FixationSessionHost webSocket={webSocket} isSpotifyAuthenticated={isSpotifyAuthenticated}/>} />
          <Route path="/live" element={<FixationPlayer webSocket={webSocket}/>} />
          <Route path="/user/access" element={<UserForm/>}/>
          <Route path="/user/myaccount" element={<UserProfile handleSpotifyAuthenticationCallback={authenticateSpotify}/>}/>
          
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
