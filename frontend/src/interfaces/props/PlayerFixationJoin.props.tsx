export interface PlayerFixationJoinProps {
  webSocket: WebSocket;
  setJoinedCallback: (displayName: string, roomCode: string) => void;
}