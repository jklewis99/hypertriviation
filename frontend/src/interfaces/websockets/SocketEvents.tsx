export interface JoinRoomEvent {
  model: string;
  payload: JoinRoomSendEventPayload;
}

interface JoinRoomSendEventPayload {
  display_name: string;
  room_code: string;
  player_session_id?: string;
}

export interface SocketEventReceived {
  event: string;
  success: boolean;
  message: string;
  data: JoinRoomReceivedEventPayload | undefined;
}

export interface JoinRoomReceivedEventPayload {
  player_session_id?: string;
  display_name: string;
  fixation_session: string;
}