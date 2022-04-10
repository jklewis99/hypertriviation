import { FixationAnswer } from "../interfaces/FixationAnswer";
import {
  JoinSessionEvent,
  SessionOpenedEvent,
  SessionQuestionChangedEvent,
  SessionQuestionRevealAnswersEvent,
  SessionSongChangedEvent,
  SessionStartedEvent,
  QuestionAnsweredEvent } from "../interfaces/websockets/SocketEvents";

export const webSocketConnectionString = "ws://localhost:8000/websockets/"

export const socketEventNames = {
  SESSION_JOIN: "session_joined",
  QUESTION_ANSWERED: "question_answered",
  SESSION_STARTED: "session_started",
  SESSION_OPENED: "session_opened",
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
    model: socketEventNames.SESSION_JOIN,
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

export const sendSessionStartedEvent = (webSocket: WebSocket, code: string, fixationId: number, multipleChoiceInd: boolean) => {
  let message: SessionStartedEvent = {
    group: code,
    model: socketEventNames.SESSION_STARTED,
    payload: {
      fixation_id: fixationId,
      room_code: code,
      session_started: true,
      multiple_choice_ind: multipleChoiceInd
    }
  };
  console.log(message);
  webSocket.send(JSON.stringify({
    message
  }));
}

export const sendSessionQuestionRevealAnswersEvent = (webSocket: WebSocket, idx: number, code: string, fixationId: number, questionTxt: string) => {
  let message: SessionQuestionRevealAnswersEvent = {
    group: code,
    model: socketEventNames.SESSION_QUESTION_REVEAL_ANSWER,
    payload: {
      fixation_id: fixationId,
      room_code: code,
      question_txt: questionTxt,
      question_idx: idx,
      do_reveal: true // change to a setting
    }
  };
  console.log(message);
  webSocket.send(JSON.stringify({
    message
  }));
}

export const sendSessionQuestionChangeEvent = (
  webSocket: WebSocket, idx: number, code: string, fixationId: number, questionTxt: string, answers: FixationAnswer[]) => {
  let message: SessionQuestionChangedEvent = {
    group: code,
    model: socketEventNames.SESSION_QUESTION_CHANGE,
    payload: {
      fixation_id: fixationId,
      room_code: code,
      question_txt: questionTxt,
      question_idx: idx,
      answers: answers
    }
  };
  console.log(message);
  webSocket.send(JSON.stringify({
    message
  }));
}

export const sendSessionSongChangeEvent = (
  webSocket: WebSocket, code: string, fixationId: number, songName: string, artistName: string) => {
  let message: SessionSongChangedEvent = {
    group: code,
    model: socketEventNames.SESSION_SONG_CHANGE,
    payload: {
      fixation_id: fixationId,
      room_code: code,
      song_name: songName,
      artist_name: artistName
    }
  };
  console.log(message);
  webSocket.send(JSON.stringify({
    message
  }));
}

export const sendQuestionAnsweredEvent = (webSocket: WebSocket, displayName: string, code: string, questionId: number, answerTxt: string, answerId?: number) => {
  // TODO: update to SubmitAnswer event type
  console.log(answerId);
  let message: QuestionAnsweredEvent = {
    group: code,
    model: socketEventNames.QUESTION_ANSWERED,
    payload: {
      display_name: displayName,
      player_session_id: "abcd",
      room_code: code,
      question_id: questionId,
      answer_id: answerId,
      answer_txt: answerTxt
    }
  };
  webSocket.send(JSON.stringify({
    message
  }));
}