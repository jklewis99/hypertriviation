import React, { useRef, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import { PlayerFixationJoinProps } from '../../interfaces/props/PlayerFixationJoin.props';
import styles from './FixationPlayerJoin.module.scss';
import { JoinSessionEvent } from '../../interfaces/websockets/SocketEvents';

const FixationPlayerJoin = (props: PlayerFixationJoinProps) => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const maxDisplayNameLength = 16;
  const roomCodeLength = 8;
  const webSocket = useRef<WebSocket>(props.webSocket).current;
  const readCode = (event: any) => {
    setRoomCode(event.target.value);
  }
  const readDisplayName = (event: any) => {
    setDisplayName(event.target.value);
  }

  const joinSession = () => {
    if (roomCode.length !== roomCodeLength
      || displayName.length > maxDisplayNameLength
      || displayName.length === 0) return;
    
    let message: JoinSessionEvent = {
      model: "joined",
      payload: {
        display_name: displayName,
        room_code: roomCode
      }
    };
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
    props.setJoinedCallback(displayName, roomCode);
  }

  return (
    <div className={styles.PlayerFixationJoin} data-testid="PlayerFixationJoin">
      <Card>
        <CardHeader title="Type in your Fixation Code!" />
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            id="filled-basic"
            label="Fixation Code"
            variant="outlined"
            error={roomCode.length !== roomCodeLength && roomCode.length !== 0}
            helperText={"Code must be exactly 8 characters"}
            onChange={readCode} />
          <TextField
            id="filled-basic"
            label="Display Name"
            variant="outlined"
            error={displayName.length > maxDisplayNameLength && displayName.length !== 0}
            helperText={`Display Name must be less than ${maxDisplayNameLength} characters`}
            onChange={readDisplayName} />
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            onClick={joinSession}
            disabled={displayName.length > maxDisplayNameLength || displayName.length === 0 || roomCode.length !== roomCodeLength}
          >Join</Button>
        </CardActions>
      </Card>
    </div>
  );
}
export default FixationPlayerJoin;
