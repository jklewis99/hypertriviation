import React, { useRef, useState } from 'react';
import styles from './FixationView.module.scss';
import { Card, CardContent, CardMedia, CardActions, Typography, Button, Dialog, Rating, Grid, ClickAwayListener, Divider, Tooltip } from "@mui/material";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fixation } from '../../interfaces/Fixation';
import FixationSettings from '../FixationSettings/FixationSettings';
import { setFixationSessionSettings, startFixationSession } from '../../services/fixation.service';
import { SetFixationSessionSettingsPayload } from '../../interfaces/payloads/SetFixationSessionSettings.payload';
import FixationSessionSettings from '../FixationSessionSettings/FixationSessionSettings';
import { SessionOpenedEvent } from '../../interfaces/websockets/SocketEvents';
import { HypertriviationUser } from '../../interfaces/HypertriviationUser';
import { handleInitialWebSocketConnection, sendSessionOpenedEvent, webSocketConnectionString } from '../../websockets/websockets';

interface FixationViewProps {
  isSpotifyAuthenticated: boolean;
  user: HypertriviationUser;
  setWebSocket: (webSocket: WebSocket) => void;
}

const FixationView = (props: FixationViewProps) => {
  const [areSettingsOpen, setAreSettingsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const selectedFixation: Fixation = useLocation().state;
  const navigate = useNavigate();

  const openFixationSettings = () => {
    //load popup to configure settings
    setAreSettingsOpen(true);
    console.log("starting", selectedFixation.fixationTitle)
  }
  const handleClosePopup = () => {
    setAreSettingsOpen(false);
  };

  const handleStartFixation = (fixationSessionSettings: SetFixationSessionSettingsPayload) => {

    startFixationSession(selectedFixation.id, 1, undefined)
      .then((session) => {
        fixationSessionSettings.fixation_session = session.fixationId;
        setFixationSessionSettings(fixationSessionSettings)
          .then((settings) => {
            console.log(settings);
            const newWebSocket = handleInitialWebSocketConnection(session.code);
            props.setWebSocket(newWebSocket);
            sendSessionOpenedEvent(newWebSocket, session.code, selectedFixation.id, props.user.username);
            navigate(`/fixations/session/${session.code}`, {
              state: {
                session: session,
                sessionSettings: settings
              }
            });
          })
          .catch((error: Error) => setErrorMessage(error.message))
      })
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => handleClosePopup());
  }

  return (
    <div className={styles.FixationView} data-testid="FixationView">
      {errorMessage !== null ? <div>{errorMessage}</div> : null}
      <Card className={styles.card} >
        <CardMedia
          component="img"
          alt={`${selectedFixation.fixationTitle} img`}
          height="50%"
          image={selectedFixation.imgUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h3" component="div">
            {selectedFixation.fixationTitle}
          </Typography>
          <Typography gutterBottom variant="body1">
            {selectedFixation.description}
          </Typography>
          <Rating name="half-rating-read" defaultValue={selectedFixation.rating} precision={0.5} size="large" readOnly />
        </CardContent>
        <Divider variant="middle" />
        <CardContent style={{ padding: "6px" }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-evenly">
            <Grid item xs={3}>
              <Typography variant="overline" display="block" >
                Created
              </Typography>
              <Typography variant="body1" component="div">
                {(new Date(selectedFixation.createdAt)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="overline" display="block">
                Category
              </Typography>
              <Typography variant="body1" component="div">
                {selectedFixation.category}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="overline" display="block">
                Created By
              </Typography>
              <Typography variant="body1" component="div">
                {selectedFixation.createdBy}
              </Typography>
            </Grid>

          </Grid>
        </CardContent>
        <Divider variant="middle" />
        <CardActions className={styles.bottomButtons}>
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
          <Button size="medium" variant="contained" color="secondary">Share</Button>
          {
            selectedFixation.category.toLowerCase() === "music"
            ?
            <Tooltip
            title={ "Must have Spotify authenticated to play this fixation"}
            placement="top"

            >
              <div>

              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={openFixationSettings}
                disabled={!props.isSpotifyAuthenticated} >
                  
                Start Fixation
              </Button>
              </div>
            </Tooltip>
            : 
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={openFixationSettings} >                
              Start Fixation
            </Button>
          }
        </CardActions>
      </Card>
      {
        areSettingsOpen
        ?
        <div>
          <Card className={styles.cardBlock} />
          <FixationSessionSettings
            closeModalCallback={handleClosePopup}
            startFixationCallback={handleStartFixation}
            selectedFixation={selectedFixation}
          />
        </div>
        :
        null
      }

    </div>
  );
}

export default FixationView;
