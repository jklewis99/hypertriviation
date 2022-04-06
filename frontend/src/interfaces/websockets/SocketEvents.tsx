export interface JoinSessionEvent {
  model: string;
  payload: JoinSessionSendEventPayload;
}

interface JoinSessionSendEventPayload {
  display_name: string;
  room_code: string;
  player_session_id?: string;
}

export interface QuestionAnsweredEvent {
  model: string;
  payload: QuestionAnsweredSendEventPayload;
}

export interface QuestionAnsweredSendEventPayload {
  display_name: string;
  player_session_id?: string;
  room_code: string;
  question_id: number;
  answer_id: number;
  answer_txt: string;
}

export interface SessionStartedEvent {
  model: string;
  payload: SessionStartedEventPayload;
}

export interface SessionStartedEventPayload {
  fixation_id: number;
  room_code: string;
  session_started: boolean;
  multiple_choice_ind: boolean;
}

export interface SessionQuestionChangedEvent {
  model: string;
  payload: SessionQuestionChangedEventPayload;
}

export interface SessionQuestionChangedEventPayload {
  fixation_id: number;
  room_code: string;
  question_txt: string;
  question_idx: number;
  answers: any[]; // TODO: needs to be an array of tuples with id and txt
}

export interface SessionSongChangedEvent {
  model: string;
  payload: SessionSongChangedEventPayload;
}

export interface SessionSongChangedEventPayload {
  fixation_id: number;
  room_code: string;
  song_name: string;
  artist_name: string;
}

export interface SessionQuestionRevealAnswersEvent {
  model: string;
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