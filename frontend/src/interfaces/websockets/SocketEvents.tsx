export interface SocketEvent {
  group: string;
  model: string;
}

export interface SessionOpenedEvent extends SocketEvent {
  payload: SessionOpenedEventPayload;
}

export interface SessionOpenedEventPayload {
  fixation_id: number;
  room_code: string;
  host: string;
}

export interface SessionStartedEvent extends SocketEvent {
  payload: SessionStartedEventPayload;
}

export interface SessionStartedEventPayload {
  fixation_id: number;
  room_code: string;
  session_started: boolean;
  multiple_choice_ind: boolean;
}

export interface JoinSessionEvent extends SocketEvent {
  payload: JoinSessionSendEventPayload;
}

interface JoinSessionSendEventPayload {
  display_name: string;
  room_code: string;
  player_session_id?: string;
}

export interface QuestionAnsweredEvent extends SocketEvent {
  payload: QuestionAnsweredSendEventPayload;
}

export interface QuestionAnsweredSendEventPayload {
  display_name: string;
  player_session_id?: string;
  room_code: string;
  question_id: number;
  answer_id?: number;
  answer_txt: string;
}

export interface SessionQuestionChangedEvent extends SocketEvent {
  payload: SessionQuestionChangedEventPayload;
}

export interface SessionQuestionChangedEventPayload {
  fixation_id: number;
  room_code: string;
  question_txt: string;
  question_idx: number;
  answers: any[]; // TODO: needs to be an array of tuples with id and txt
}

export interface SessionSongChangedEvent extends SocketEvent {
  payload: SessionSongChangedEventPayload;
}

export interface SessionSongChangedEventPayload {
  fixation_id: number;
  room_code: string;
  song_name: string;
  artist_name: string;
}

export interface SessionQuestionRevealAnswersEvent extends SocketEvent {
  payload: SessionQuestionRevealAnswersEventPayload;
}

export interface SessionQuestionRevealAnswersEventPayload {
  fixation_id: number;
  room_code: string;
  question_txt: string;
  question_idx: number;
  do_reveal: boolean;
}


export interface SocketEventReceived {
  event: string;
  success: boolean;
  message: string;
  code: string;
  data: JoinSessionReceivedEventPayload |
  QuestionAnsweredSendEventPayload | 
  SessionStartedEventPayload | 
  SessionQuestionChangedEventPayload | 
  SessionQuestionRevealAnswersEventPayload |
  SessionSongChangedEventPayload;
}

export interface JoinSessionReceivedEventPayload {
  player_session_id?: string;
  display_name: string;
  fixation_session: string;
}