import { JoinSessionEvent, SessionOpenedEvent } from "../interfaces/websockets/SocketEvents";

export const webSocketConnectionString = "ws://localhost:8000/websockets/"

const socketEventNames = {
  SESSION_JOIN: "joined",
  ANSWER_QUESTION: "answer",
  SESSION_OPENED: "session_opened",
  SESSION_STARTED: "session_started",
  SESSION_QUESTION_CHANGE: "session_question_change",
  SESSION_SONG_CHANGE: "session_song_change",
  SESSION_QUESTION_REVEAL_ANSWER: "session_question_reveal_answer",
}

/**
 * Method that waits until the socket state is open before sending events
 * @param socket 
 * @param callback 
 */
const waitForSocketConnection = (socket: WebSocket, callback: () => void) => {
  setTimeout(() => {
    if (socket.readyState === 1) {
      console.log("Connection is made")
      callback();
    } else {
      console.log("Wait for connection...")
      waitForSocketConnection(socket, callback);
    }

  }, 5); // wait 5 milisecond for the connection...
}

export const handleInitialWebSocketConnection = (code: string) => {
  let newWebSocket = new WebSocket(webSocketConnectionString + code);
  return connectWebSocket(newWebSocket);
}

const connectWebSocket = (webSocket: WebSocket) => {
  webSocket.onopen = (event) => console.log("WebSocket connected!", event);
  webSocket.onmessage = (event) => console.log("EVENT DATA: ", event.data);
  webSocket.onclose = (event) => {
    console.log(
      `WebSocket is closed. Reconnect will be attempted in 1 second.`,
      event
    );
    setTimeout(() => {
      connectWebSocket(webSocket);
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

  return webSocket;
}

export const sendSessionOpenedEvent = (webSocket: WebSocket, code: string, fixationId: number, username: string) => {
  let message: SessionOpenedEvent = {
    group: code,
    model: socketEventNames.SESSION_OPENED,
    payload: {
      fixation_id: fixationId,
      room_code: code,
      host: username
    }
  };
  waitForSocketConnection(webSocket, () => {
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
  });
}

export const sendSessionJoinedEvent = (webSocket: WebSocket, code: string, displayName: string) => {

  let message: JoinSessionEvent = {
    group: code,
    model: "joined",
    payload: {
      display_name: displayName,
      room_code: code
    }
  };
  waitForSocketConnection(webSocket, () => {
    console.log(message);
    webSocket.send(JSON.stringify({
      message
    }));
  });
}