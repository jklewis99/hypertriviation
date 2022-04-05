import { JoinSessionReceivedEventPayload, QuestionAnsweredSendEventPayload, SessionQuestionChangedEventPayload, SessionStartedEventPayload } from "./SocketEvents";

// All of this seems wrong
export function isJoinSessionReceivedEventPayload(eventPayload: 
  JoinSessionReceivedEventPayload |
  QuestionAnsweredSendEventPayload |
  SessionStartedEventPayload | 
  SessionQuestionChangedEventPayload): eventPayload is JoinSessionReceivedEventPayload {
  const payload = eventPayload as JoinSessionReceivedEventPayload;
  return payload.display_name !== undefined && payload.fixation_session !== undefined;
}

export function isQuestionAnsweredSendEventPayload(eventPayload: 
  JoinSessionReceivedEventPayload |
  QuestionAnsweredSendEventPayload |
  SessionStartedEventPayload | 
  SessionQuestionChangedEventPayload): eventPayload is QuestionAnsweredSendEventPayload {
  const payload = eventPayload as QuestionAnsweredSendEventPayload;
  return payload.display_name !== undefined && payload.question_id !== undefined;
}

export function isSessionStartedEventPayload(eventPayload: 
  JoinSessionReceivedEventPayload |
  QuestionAnsweredSendEventPayload |
  SessionStartedEventPayload | 
  SessionQuestionChangedEventPayload): eventPayload is SessionStartedEventPayload {
  const payload = eventPayload as SessionStartedEventPayload;
  return payload.fixation_id !== undefined && payload.room_code !== undefined && payload.session_started !== undefined;
}

export function isSessionQuestionChangedEventPayload(eventPayload: 
  JoinSessionReceivedEventPayload |
  QuestionAnsweredSendEventPayload |
  SessionStartedEventPayload | 
  SessionQuestionChangedEventPayload): eventPayload is SessionQuestionChangedEventPayload {
  const payload = eventPayload as SessionQuestionChangedEventPayload;
  return payload.fixation_id !== undefined && payload.room_code !== undefined && payload.question_idx !== undefined && payload.question_txt !== undefined;
}