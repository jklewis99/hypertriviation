export interface PlayerFixationJoinProps {
  webSocket: WebSocket;
  setJoinedCallback: (displayName: string) => void;
}