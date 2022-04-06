export interface MusicPlayerProps {
  spotifyUri: string;
  playlistOffset: number;
  songOffset: number;
  goToNextSong: (songName: string, artistsName: string) => void;
}