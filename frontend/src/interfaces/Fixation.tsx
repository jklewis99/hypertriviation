export interface Fixation {
  id: number;
  createdBy: string;
  fixationTitle: string;
  description?: string;
  category: string;
  imgUrl: string;
  keepShuffled: boolean;
  spotifyPlaylistId: string;
  questionCount: number;
  rating: number;
  createdAt: string;
}